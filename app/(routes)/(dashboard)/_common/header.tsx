"use client";

import { useRouter } from "next/navigation";
import { RiAddLine, RiHistoryLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocalChat } from "@/hooks/use-local-chat";

interface HeaderProps {
  title?: string;
  showActions?: boolean;
}

const Header = ({ title, showActions }: HeaderProps) => {
  const { open: isSidebarOpen, isMobile } = useSidebar();
  const router = useRouter();

  const handleNewChatClick = () => router.push("/chat");

  const { onToggleHistory } = useLocalChat();

  return (
    <header
      className={cn(
        `fixed top-1.5 left-0 right-0 z-50 flex items-center h-10 bg-background/20 backdrop-blur-sm rounded-md 
        shadow-sm transition-all duration-250`,
        isSidebarOpen && !isMobile && "md:ml-[256px]"
      )}
    >
      {/* 左侧：侧边栏触发器 */}
      <div className="pl-3">
        {(!isSidebarOpen || isMobile) && (
          <SidebarTrigger className="cursor-pointer" />
        )}
      </div>

      {/* 中间：标题区域 */}
      {title && (
        <div className="flex-1 min-w-0 mx-3">
          <h2
            className="text-lg lg:text-xl font-semibold truncate text-foreground/90"
            title={title}
          >
            {title}
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
            onClick={onToggleHistory}
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
