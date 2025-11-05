"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { cn, generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import ChatInput from "./chat-input";
import { toast } from "sonner";
import ChatMessages from "./chat-messages";

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
      onFinish: () => {},
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
