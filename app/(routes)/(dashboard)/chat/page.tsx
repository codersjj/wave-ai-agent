"use client";

import ChatInterface from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import Header from "../_common/header";

const Chat = () => {
  const id = generateUUID();

  return (
    <div>
      <Header showActions chatId={id} />
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
