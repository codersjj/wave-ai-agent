"use client";

import { useEffect, useState } from "react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import ChatInput from "./chat-input";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: UIMessage[];
  initialLoading: boolean;
  onlyInput?: boolean;
  inputDisabled?: boolean;
}

const ChatInterface = ({
  chatId,
  initialMessages,
  initialLoading,
  onlyInput = false,
  inputDisabled,
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
          return {
            body: {
              ...body,
              id,
              messages: messages.at(-1),
              selectedModelId: DEFAULT_MODEL_ID,
            },
          };
        },
      }),
      async onToolCall() {},
      onFinish: () => {},
      onError: (error) => {
        console.log("Chat error:", error);
      },
    });

  useEffect(() => {
    if (initialMessages && initialMessages.length) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  if (onlyInput) {
    return <div className="relative w-full">{/* Chat Input */}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-auto">
      {/* Chat Messages */}
      <div className="h-screen"></div>

      <div className="sticky bottom-1 mx-auto px-4 pb-1 w-full md:max-w-3xl bg-background">
        <ChatInput
          chatId={chatId}
          input={input}
          messages={messages}
          status={status}
          initialModelId={DEFAULT_MODEL_ID}
          setInput={setInput}
          setMessages={setMessages}
          sendMessage={sendMessage}
          stop={stop}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
