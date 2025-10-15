import { RiAddLine } from "@remixicon/react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";

const NavNotes = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <h5>Notes</h5>
        <SidebarGroupAction className="mt-[1.5px] flex items-center size-5.5 border cursor-pointer rounded-md">
          <RiAddLine className="size-5!" />
          <span className="sr-only">Add Note</span>
        </SidebarGroupAction>
      </SidebarGroupLabel>
      <SidebarGroupContent className="w-full min-h-32 max-h-[360px] overflow-y-auto">
        <SidebarMenu>
          <SidebarMenuItem>No Notes</SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavNotes;
