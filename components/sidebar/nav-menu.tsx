import { RemixiconComponentType } from "@remixicon/react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

type NavMenuProps = {
  items: {
    title: string;
    url: string;
    icon: RemixiconComponentType;
  }[];
};

const NavMenu = ({ items }: NavMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const { title, url } = item;

        const isActive = pathname === url;

        return (
          <SidebarMenuItem key={title} className="flex flex-col items-stretch">
            <SidebarMenuButton
              className="group h-9 font-medium rounded-md
                bg-gradient-to-r
                hover:from-sidebar-accent hover:to-sidebar-accent/40
                data-[active=true]:from-primary/20 data-[active=true]:to-primary/5
                [&>svg]:size-auto cursor-pointer"
              isActive={isActive}
              onClick={() => router.push(url)}
            >
              <item.icon
                className="text-muted-foreground/60 group-data-[active=true]:text-primary"
                size={22}
              />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default NavMenu;
