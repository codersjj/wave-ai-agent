"use client";

import { RiFileTextLine, RiLoader5Line } from "@remixicon/react";
import { useNotes, useCreateNote } from "@/features/use-notes";
import useNoteId from "@/hooks/use-note-id";
import EmptyState from "@/components/empty-state";

const RecentNotes = () => {
  const { data, isPending: isNotesPending } = useNotes();
  const { setNoteId } = useNoteId();
  const { mutate, isPending: isCreateNotePending } = useCreateNote();

  const notes = data?.data ?? [];

  const handleNoteClick = (noteId: string) => {
    setNoteId(noteId);
  };

  const handleCreateNote = () => {
    mutate({
      title: "Untitled",
      content: "",
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-4 mx-4 md:mx-0">
      {isNotesPending ? (
        <div className="flex justify-center items-center h-full">
          <RiLoader5Line className="size-10 text-primary animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          title="No notes found"
          description="Create a new note to get started"
          iconClassName="size-8"
          isLoading={isCreateNotePending}
          onButtonClick={handleCreateNote}
        />
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => {
            return (
              <li
                key={note.id}
                className="flex items-center gap-2 hover:bg-accent cursor-pointer"
                onClick={() => handleNoteClick(note.id)}
              >
                <div className="flex justify-center items-center size-8 dark:text-white/80 bg-secondary rounded-lg">
                  <RiFileTextLine className="size-5 text-primary" />
                </div>
                <h5 className="flex-1 text-sm font-medium truncate">
                  {note.title}
                </h5>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentNotes;
