"use client";

import { useState } from "react";
import ChatInterface from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import Header from "../_common/header";
import { useChatById } from "@/features/use-chat";

const Chat = () => {
  const [id] = useState(() => generateUUID());
  // const id = generateUUID();
  const { data } = useChatById(id, false);
  const title = data?.title;
  console.log("🚀 ~ Chat ~ title:", title);

  return (
    <div>
      <Header title={title} showActions />
      <ChatInterface
        // see: https://react.dev/reference/react/useState#resetting-state-with-a-key
        key={id}
        chatId={id}
        initialMessages={[]}
        initialLoading={false}
        onlyInput={false}
      />
    </div>
  );
};

export default Chat;
