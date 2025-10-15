"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiBankCard2Line,
  RiChatAiLine,
  RiScanLine,
  RiSettings3Line,
} from "@remixicon/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import Logo from "@/components/logo";
import { useAuthToken } from "@/hooks/use-auth-token";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NavUser from "./nav-user";
import NavMenu from "./nav-menu";
import NavNotes from "./nav-notes";

const navMenuItems = [
  {
    title: "Home",
    url: "/home",
    icon: RiScanLine,
  },
  {
    title: "AI Chat",
    url: "/chat",
    icon: RiChatAiLine,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: RiBankCard2Line,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: RiSettings3Line,
  },
];

const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const { clearBearerToken } = useAuthToken();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const { signOut, useSession } = authClient;
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsSigningOut(false);
          clearBearerToken();
          router.push("/auth/sign-in");
        },
        onError: (ctx) => {
          setIsSigningOut(false);
          toast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <Sidebar {...props} className={cn("z-99", props.className)}>
      <SidebarHeader>
        <div className="flex justify-between items-center w-full">
          <Logo url="/home" />
          <SidebarTrigger className="-ms-4" />
        </div>
        <hr className="mx-2 -mt-px border-border" />
        {/* Search Button */}
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2 overflow-x-hidden">
        <NavMenu items={navMenuItems} />
        <NavNotes />
      </SidebarContent>
      <SidebarFooter>
        <hr className="mx-2 -mt-px border-border" />
        <NavUser
          isLoading={isPending}
          user={{
            name: user?.name || "",
            email: user?.email || "",
          }}
          isSigningOut={isSigningOut}
          onSignOut={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
