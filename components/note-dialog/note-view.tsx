import { useNote, useUpdateNote } from "@/features/use-notes";
import { RiLoader5Fill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import useNoteId from "@/hooks/use-note-id";

const NoteView = ({ noteId }: { noteId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const titleTextareaRef = useRef<AutosizeTextAreaRef>(null);
  const contentTextareaRef = useRef<AutosizeTextAreaRef>(null);

  const { data, isPending: isNotePending } = useNote(noteId);
  const { mutate, isPending: isUpdateNotePending } = useUpdateNote();
  const { clearNoteId } = useNoteId();

  const note = data?.data;

  const isSaveBtnDisabled = isUpdateNotePending || !noteId || !title.trim();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  useEffect(() => {
    if (!isNotePending) {
      const titleTextareaEle = titleTextareaRef.current;
      if (titleTextareaEle) {
        titleTextareaEle.textArea.focus();
      }
    }
  }, [isNotePending]);

  const handleSaveChanges = () => {
    if (isSaveBtnDisabled) return;
    mutate(
      {
        param: { id: noteId },
        json: { title, content },
      },
      {
        onSuccess: () => {
          clearNoteId();
        },
      }
    );
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      contentTextareaRef.current?.textArea.focus();
    }
  };

  if (isNotePending) {
    return (
      <div className="flex justify-center items-center h-full">
        <RiLoader5Fill className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 p-4">
      {/* Title Section */}
      <div className="flex-shrink-0 mb-4">
        <AutosizeTextarea
          ref={titleTextareaRef}
          value={title}
          placeholder="Title"
          className="outline-none border-none px-0 max-h-30! text-4xl leading-tight font-bold
          placeholder:text-muted-foreground/50 resize-none focus-visible:ring-0"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
        />
        <hr className="border-border mt-4" />
      </div>

      {/* Content Section - Auto height */}
      <AutosizeTextarea
        ref={contentTextareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="max-h-[65vh]! outline-none border-none px-0 text-base leading-relaxed font-normal
          placeholder:text-muted-foreground/50 resize-none focus-visible:ring-0 overflow-y-auto"
      />

      {/* Save Button - Sticky at bottom */}
      <div className="sticky bottom-2 flex justify-end mt-4">
        <Button
          size={"lg"}
          className="px-10 text-lg cursor-pointer rounded-full has-[>svg]:px-10"
          disabled={isSaveBtnDisabled}
          onClick={handleSaveChanges}
        >
          {isUpdateNotePending && (
            <RiLoader5Fill className="size-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NoteView;
