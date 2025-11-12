"use client";

import { useRouter } from "next/navigation";
import { RiAddLine, RiHistoryLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocalChat } from "@/hooks/use-local-chat";
import { useQueryClient } from "@tanstack/react-query";
import { useChatById } from "@/features/use-chat";

interface HeaderProps {
  title?: string;
  showActions?: boolean;
  chatId?: string;
}

const Header = ({ title, showActions, chatId }: HeaderProps) => {
  const { open: isSidebarOpen, isMobile } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleNewChatClick = () => router.push("/chat");

  const { isHistoryOpen, onToggleHistory } = useLocalChat();

  const handleHistoryClick = async (isHistoryOpen: boolean) => {
    onToggleHistory();
    if (!isHistoryOpen) {
      // 直接重新获取聊天列表
      await queryClient.refetchQueries({
        queryKey: ["chats"],
        exact: true,
      });
    }
  };

  const { data } = useChatById(chatId ?? "", false);
  const showTitle = data?.title || title;
  console.log("🚀 ~ Header ~ showTitle:", showTitle);

  return (
    <header
      className={cn(
        `fixed top-1.5 left-0 right-0 z-50 flex items-center h-10 bg-background/20 backdrop-blur-sm rounded-md 
        shadow-sm transition-all duration-250`,
        isSidebarOpen && !isMobile && "md:ml-[256px]"
      )}
    >
      {/* 左侧：侧边栏触发器 */}
      <div className="relative flex items-center pl-3 h-full">
        {/* {(!isSidebarOpen || isMobile) && ( */}
        <SidebarTrigger
          className={cn(
            "transition-opacity cursor-pointer",
            // 移动端始终显示
            isMobile && "opacity-100",
            // 桌面端：侧边栏关闭时才显示，且有延迟
            !isMobile &&
              !isSidebarOpen &&
              "absolute top-1/2 left-1/2 -translate-y-1/2 opacity-100 delay-100",
            // 桌面端：侧边栏打开时隐藏
            !isMobile &&
              isSidebarOpen &&
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0"
          )}
        />
        {/* )} */}
      </div>

      {/* 中间：标题区域 */}
      {showTitle && (
        <div
          className={cn(
            "flex-1 min-w-0 mx-3 transition-transform",
            !isMobile && !isSidebarOpen && "translate-x-4 delay-100"
          )}
        >
          <h2
            className="text-lg lg:text-xl font-semibold truncate text-foreground/90"
            title={showTitle}
          >
            {showTitle}
          </h2>
        </div>
      )}

      {/* 右侧：操作按钮 */}
      {showActions && (
        <div className="flex items-center gap-1 ml-auto pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 cursor-pointer"
            onClick={handleNewChatClick}
          >
            <RiAddLine className="size-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 cursor-pointer"
            onClick={() => handleHistoryClick(isHistoryOpen)}
          >
            <RiHistoryLine className="size-4" />
            <span className="hidden sm:inline">Chat History</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
