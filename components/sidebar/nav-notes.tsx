import dynamic from "next/dynamic";
import { RiAddLine, RiFileTextLine } from "@remixicon/react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useCreateNote, useNotes } from "@/features/use-notes";
import LoaderOverlay from "../loader-overlay";

const SidebarMenuSkeletonClient = dynamic(
  () => import("../ui/sidebar").then((m) => m.SidebarMenuSkeleton),
  { ssr: false }
);

const NavNotes = () => {
  const { data, isPending: isLoadingNotes } = useNotes();
  const { mutate, isPending: isCreatingNote } = useCreateNote();

  const notes = data?.data ?? [];

  const handleCreateNote = () => {
    mutate({
      title: "Untitled",
      content: "",
    });
  };

  return (
    <>
      <LoaderOverlay show={isCreatingNote} text="Creating note..." />
      <SidebarGroup>
        <SidebarGroupLabel>
          <h5>Notes</h5>
          <SidebarGroupAction
            className="mt-[1.5px] flex items-center size-5.5 border cursor-pointer rounded-md bg-primary/20 hover:bg-primary/30"
            disabled={isCreatingNote}
            onClick={handleCreateNote}
          >
            <RiAddLine className="size-5!" />
            <span className="sr-only">Add Note</span>
          </SidebarGroupAction>
        </SidebarGroupLabel>
        <SidebarGroupContent className="w-full min-h-32 max-h-[360px] overflow-y-auto">
          <SidebarMenu>
            {isLoadingNotes ? (
              <div className="mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuSkeletonClient key={i} showIcon />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="mt-4">No Notes</div>
            ) : (
              notes.map((note) => {
                // const isActive = note.id === noteId
                return (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton onClick={() => {}}>
                      <span className="flex justify-center items-center size-8 rounded-lg bg-secondary">
                        <RiFileTextLine className="size-4! text-primary" />
                      </span>
                      <h5 className="flex-1 truncate">{note.title}</h5>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default NavNotes;
