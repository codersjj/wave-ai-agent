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
import {
  checkGenerationLimit,
  generateTitleForUserMessage,
} from "@/app/actions";
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
  isDeepThink: z.boolean().optional().default(false),
});

const chatIdSchema = z.object({
  id: z.string().min(1),
});

const updateMessagePartsSchema = z.object({
  parts: z.any(), // JSON 类型，包含更新后的 parts
});

const messageIdSchema = z.object({
  messageId: z.string().min(1),
});

// 用于流结束后一次性写入最终 parts（含 UI duration）
const finalizeMessageSchema = z.object({
  chatId: z.string().min(1),
  parts: z.any(),
});

export const chatApp = new Hono()
  .post(
    "/",
    zValidator("json", chatSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const { id, message, selectedModelId, selectedToolName, isDeepThink } =
          c.req.valid("json");

        const { isAllowed } = await checkGenerationLimit(user.id);

        if (!isAllowed) {
          throw new HTTPException(403, {
            message: "Generation limit reached!",
          });
        }

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

        // parts 直接从数据库读取，如果之前保存过 duration，会自动包含
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
                // Turn on dynamic thinking:
                thinkingBudget: -1,
                includeThoughts: isDeepThink,
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
          // originalMessages: newUIMessages,
          generateMessageId: generateUUID,
          onFinish: async (event) => {
            const { messages, responseMessage } = event;
            console.log("completed messages length", messages.length);
            console.log("responseMessage", responseMessage);
            try {
              // 当启用思考模式时，仅持久化非 assistant 的消息（如 tool 调用等）
              // assistant 最终消息交由前端 finalize 接口一次性写入，避免重复
              let msgs = messages;
              if (isDeepThink) {
                const nonAssistantMessages = messages.filter(
                  (m) => m.role !== "assistant"
                );
                msgs = nonAssistantMessages;
              }
              if (msgs.length > 0) {
                await prisma.message.createMany({
                  data: msgs.map((m) => ({
                    id: m.id,
                    role: m.role,
                    parts: JSON.parse(JSON.stringify(m.parts)),
                    chatId: id,
                    // 删除 createdAt 和 updatedAt，让数据库自动设置
                  })),
                  skipDuplicates: true,
                });
              }
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
  .post(
    "/message/:messageId/finalize",
    zValidator("param", messageIdSchema),
    zValidator("json", finalizeMessageSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { messageId } = c.req.valid("param");
        const { chatId, parts } = c.req.valid("json");
        const user = c.get("user");

        // 校验 chat 属于当前用户
        const chat = await prisma.chat.findFirst({
          where: { id: chatId, userId: user.id },
        });
        if (!chat) {
          throw new HTTPException(404, { message: "Chat not found" });
        }

        // upsert 最终的 assistant 消息 parts
        const saved = await prisma.message.upsert({
          where: { id: messageId },
          update: { parts: JSON.parse(JSON.stringify(parts)) },
          create: {
            id: messageId,
            role: "assistant",
            parts: JSON.parse(JSON.stringify(parts)),
            chatId,
          },
        });

        return c.json({ success: true, data: saved });
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
