"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { cn, generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import ChatInput from "./chat-input";
import { toast } from "sonner";
import ChatMessages from "./chat-messages";
import { api } from "@/lib/hono/rpc";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: UIMessage[];
  initialLoading: boolean;
  onlyInput?: boolean;
  inputDisabled?: boolean;
  className?: string;
}

const ChatInterface = ({
  chatId,
  initialMessages,
  initialLoading,
  onlyInput = false,
  inputDisabled,
  className,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState<string>("");
  const queryClient = useQueryClient();

  const { messages, setMessages, sendMessage, status, stop, error } =
    useChat<UIMessage>({
      id: chatId,
      messages: initialMessages,
      generateId: generateUUID,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages, body }) => {
          console.log("🚀 ~ ChatInterface ~ body:", body);
          return {
            body: {
              ...body,
              id,
              message: messages.at(-1),
              selectedModelId: DEFAULT_MODEL_ID,
            },
          };
        },
      }),
      async onToolCall() {},
      onFinish: async ({ messages }) => {
        // 检查是否是新聊天的第一条用户消息并收到回复
        const isUserFirstMessage =
          messages.length === 2 &&
          messages[0]?.role === "user" &&
          messages[1]?.role === "assistant";

        if (isUserFirstMessage) {
          console.log(
            "🔄 New chat first message completed, fetching chat title for chatId:",
            chatId
          );
          // 只在新聊天第一条消息完成时请求 title 数据
          await queryClient.fetchQuery({
            queryKey: ["chat", chatId],
            queryFn: async () => {
              const res = await api.chat[":id"].$get({ param: { id: chatId } });
              if (!res.ok) throw new Error("Failed to fetch chat");
              const { data } = await res.json();
              return data;
            },
          });
        }
      },
      onError: (error) => {
        console.log("Chat error:", error);
        // toast.error(error instanceof Error ? error.message : "useChat error");
      },
    });

  useEffect(() => {
    if (initialMessages && initialMessages.length) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  if (onlyInput) {
    return (
      <div className={cn("relative w-full min-h-32", className)}>
        <ChatInput
          chatId={chatId}
          input={input}
          status={status}
          initialModelId={DEFAULT_MODEL_ID}
          disabled={inputDisabled}
          setInput={setInput}
          sendMessage={sendMessage}
          stop={stop}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-10 h-screen bg-background overflow-auto">
      {/* Chat Messages */}
      <ChatMessages
        chatId={chatId}
        messages={messages}
        status={status}
        error={error}
        isLoading={initialLoading}
      />

      <div className="sticky bottom-1 mx-auto px-4 pb-1 w-full md:max-w-3xl bg-background">
        <ChatInput
          chatId={chatId}
          input={input}
          status={status}
          initialModelId={DEFAULT_MODEL_ID}
          disabled={inputDisabled}
          setInput={setInput}
          sendMessage={sendMessage}
          stop={stop}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
