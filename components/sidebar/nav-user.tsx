import { RiLoader5Fill, RiLogoutBoxLine } from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChevronsUpDownIcon } from "lucide-react";

interface NavUserProps {
  isLoading: boolean;
  user: {
    name: string;
    email: string;
  };
  isSigningOut: boolean;
  onSignOut: () => void;
}

const NavUser = ({
  isLoading,
  user,
  isSigningOut,
  onSignOut,
}: NavUserProps) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {isLoading ? (
            <RiLoader5Fill className="w-5 h-5 animate-spin" />
          ) : (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="border border-primary w-8 h-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col min-w-0 text-left text-sm leading-tight">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="font-medium truncate">{user.email}</span>
                </div>
                <ChevronsUpDownIcon className="size-4!" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => {
              if (isSigningOut) {
                console.log("isSigningOut");
                e.preventDefault();
              }
            }}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="border border-primary w-8 h-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col min-w-0 text-left text-sm leading-tight">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="font-medium truncate">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="relative"
              disabled={isSigningOut}
              onClick={onSignOut}
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <RiLogoutBoxLine className="text-muted-foreground" />
              Logout
              {isSigningOut && (
                <RiLoader5Fill className="w-4! h-4! absolute right-2 animate-spin" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
