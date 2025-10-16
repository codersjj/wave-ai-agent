"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const Header = () => {
  const { open: isSidebarOpen, isMobile } = useSidebar();

  return (
    <header className="fixed top-2 left-2 z-9 h-[40px] flex items-center bg-background/20 backdrop-blur-sm">
      {(!isSidebarOpen || isMobile) && <SidebarTrigger />}
    </header>
  );
};

export default Header;
