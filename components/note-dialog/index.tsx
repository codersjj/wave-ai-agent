"use client";

import useNoteId from "@/hooks/use-note-id";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import NoteView from "./note-view";

const NoteDialog = () => {
  const { noteId, clearNoteId } = useNoteId();

  const isOpen = Boolean(noteId);

  const handleClose = () => {
    clearNoteId();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="z-99" overlayClassName="z-99">
        <SheetHeader className="border-b bg-muted">
          <SheetTitle>Note</SheetTitle>
          <SheetDescription>Edit your note</SheetDescription>
        </SheetHeader>
        <div className="flex-1">{noteId && <NoteView noteId={noteId} />}</div>
      </SheetContent>
    </Sheet>
  );
};

export default NoteDialog;
