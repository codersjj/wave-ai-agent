"use client";

import { useParams } from "next/navigation";
import ChatInterface from "@/components/chat";
import { useChatById } from "@/features/use-chat";

const SingleChat = () => {
  const params = useParams();
  const chatId = params?.chatId as string;

  const { data, isLoading } = useChatById(chatId);

  const initialMessages = data?.messages ?? [];

  return (
    <div>
      <ChatInterface
        chatId={chatId}
        initialMessages={initialMessages}
        initialLoading={isLoading}
        onlyInput={false}
      />
    </div>
  );
};

export default SingleChat;
