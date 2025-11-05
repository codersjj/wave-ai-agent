"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useChats } from "@/features/use-chat";
import { useLocalChat } from "@/hooks/use-local-chat";
import { cn } from "@/lib/utils";
import { RiChatAiLine, RiLoader5Fill } from "@remixicon/react";
import { XIcon } from "lucide-react";

const ChatHistory = () => {
  const { open } = useSidebar();
  const router = useRouter();
  const { isHistoryOpen, onToggleHistory } = useLocalChat();
  const { data, isPending, isError, error } = useChats();
  const chatHistory = data ?? [];

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    onToggleHistory();
  };

  return (
    <div
      className={cn(
        `fixed z-99 top-0 left-0 bottom-0 border border-border p-2 w-64 
        bg-background transition-all duration-300 ease-in-out`,
        open && isHistoryOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex justify-between items-center border-b border-border h-10">
        <h5 className="text-base font-medium">Chat History</h5>
        <Button
          className="cursor-pointer"
          variant={"ghost"}
          size="icon"
          onClick={onToggleHistory}
        >
          <XIcon className="size-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-1 pt-2 min-h-40 max-h-[calc(100vh-49px)] overflow-auto bg-background">
        {isPending && (
          <div className="flex-1 flex justify-center items-center">
            <RiLoader5Fill className="size-8 text-primary animate-spin" />
          </div>
        )}
        {isError && <p>{error.message}</p>}
        {!isPending && chatHistory.length === 0 ? (
          <p>No Chat</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {chatHistory.map((chat) => (
              <li key={chat.id} className="text-sm">
                <button
                  className="flex items-center gap-2 rounded-lg py-2 w-full hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <RiChatAiLine className="size-5 text-muted-foreground" />
                  <div className="flex-1 flex flex-col items-start gap-0.5 min-w-0 overflow-hidden">
                    <h3 className="self-stretch text-left font-semibold truncate">
                      {chat.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(chat.updatedAt), "MMM d yyyy")}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
