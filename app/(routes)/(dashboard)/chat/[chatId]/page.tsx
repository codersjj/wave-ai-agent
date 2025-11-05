"use client";

import { useParams } from "next/navigation";
import ChatInterface from "@/components/chat";
import { useChatById } from "@/features/use-chat";
import Header from "../../_common/header";

const SingleChat = () => {
  const params = useParams();
  const chatId = params?.chatId as string;

  const { data, isLoading } = useChatById(chatId);

  const title = data?.title ?? "Untitled";
  const initialMessages = data?.messages ?? [];

  return (
    <div>
      <Header title={title} showActions />
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
