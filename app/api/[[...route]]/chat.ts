import { Hono } from "hono";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  UIMessage,
  UIMessagePart,
} from "ai";
import z from "zod";
import { ChatModel, DEVELOPMENT_CHAT_MODEL } from "@/lib/ai/models";
import { zValidator } from "@hono/zod-validator";
import { getAuthUserMiddleware } from "@/lib/hono/middleware";
import prisma from "@/lib/prisma";
import { generateTitleForUserMessage } from "@/app/actions";
import { isProduction, myProvider } from "@/lib/ai/provider";
import { generateUUID } from "@/lib/utils";
import { HTTPException } from "hono/http-exception";
import createNote from "@/lib/ai/tools/create-note";
import searchNote from "@/lib/ai/tools/search-note";
import webSearch from "@/lib/ai/tools/web-search";
import extractWebUrl from "@/lib/ai/tools/extract-web-url";
import { getSystemPrompt } from "@/lib/ai/prompt";

const chatSchema = z.object({
  /**
   * Unique identifier for the chat session
   */
  id: z.string().min(1),
  message: z.custom<UIMessage>((val) => {
    return typeof val === "object" && val !== null;
  }),
  selectedModelId: z.string() as z.ZodType<ChatModel["id"]>,
  selectedToolName: z.string().nullable(),
});

const chatIdSchema = z.object({
  id: z.string().min(1),
});

export const chatApp = new Hono()
  .post(
    "/",
    zValidator("json", chatSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const { id, message, selectedModelId, selectedToolName } =
          c.req.valid("json");

        // find the chat data
        let chat = await prisma.chat.findUnique({
          where: {
            id,
          },
        });

        // if the chat is not existed, create
        if (!chat) {
          const title = await generateTitleForUserMessage(message);
          console.log("🚀 ~ title:", title);
          chat = await prisma.chat.create({
            data: {
              id,
              userId: user.id,
              title,
            },
          });
        }

        // get messages of this chat from db
        const messagesFromDB = await prisma.message.findMany({
          where: {
            chatId: id,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        const mappedUIMessages = messagesFromDB.map(
          ({ id, role, parts, chatId, createdAt, updatedAt }) => ({
            id,
            role,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parts: parts as UIMessagePart<any, any>[],
            metadata: {
              chatId,
              createdAt,
              updatedAt,
            },
          })
        );

        // add new message
        const newUIMessages = [...mappedUIMessages, message];

        const modelMessages = convertToModelMessages(newUIMessages);

        // save new message to DB
        await prisma.message.create({
          data: {
            id: message.id,
            role: "user",
            parts: JSON.parse(JSON.stringify(message.parts)),
            chatId: id,
          },
        });

        // ask AI model
        const model = myProvider.languageModel(
          isProduction ? selectedModelId : DEVELOPMENT_CHAT_MODEL
        );
        const result = await streamText({
          model,
          providerOptions: {
            google: {
              // see: https://ai.google.dev/gemini-api/docs/thinking
              thinkingConfig: {
                thinkingBudget: 1024,
                includeThoughts: true,
              },
            },
          },
          system: getSystemPrompt(selectedToolName),
          messages: modelMessages,
          tools: {
            createNote: createNote(user.id),
            searchNote: searchNote(user.id),
            webSearch: webSearch(),
            extractWebUrl: extractWebUrl(),
          },
          toolChoice: "auto",
          stopWhen: stepCountIs(5),
          onError: (error) => {
            console.log("Streaming error:", error);
          },
        });

        return result.toUIMessageStreamResponse({
          sendSources: true,
          sendReasoning: true,
          originalMessages: newUIMessages,
          onFinish: async (event) => {
            const { messages, responseMessage } = event;
            console.log("completed messages length", messages.length);
            console.log("responseMessage", responseMessage);
            try {
              await prisma.message.createMany({
                data: messages.map((m) => ({
                  id: m.id || generateUUID(),
                  role: m.role,
                  parts: JSON.parse(JSON.stringify(m.parts)),
                  chatId: id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                })),
                skipDuplicates: true,
              });
            } catch (error) {
              console.log("toUIMessageStreamResponse onFinish error:", error);
            }
          },
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  )
  .get("/", getAuthUserMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const chats = await prisma.chat.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return c.json({
        success: true,
        data: chats,
      });
    } catch (error) {
      console.log("Failed to fetch chats", error);
      throw new HTTPException(500, { message: "Internal Server Error" });
    }
  })
  .get(
    "/:id",
    zValidator("param", chatIdSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const user = c.get("user");

        const chat = await prisma.chat.findFirst({
          where: {
            id,
            userId: user.id,
          },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        });

        if (!chat) {
          return c.json({
            success: true,
            data: {},
          });
        }

        const uiMessages: UIMessage[] = chat.messages.map((m) => ({
          id: m.id,
          role: m.role,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parts: m.parts as UIMessagePart<any, any>[],
          metadata: {
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            chatId: m.chatId,
          },
        }));

        const chatWithUIMessages = {
          ...chat,
          messages: uiMessages,
        };

        return c.json({
          success: true,
          data: chatWithUIMessages,
        });
      } catch (error) {
        console.log("Failed to fetch chat", error);
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  );
