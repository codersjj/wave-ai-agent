import { memo } from "react";
import { RiFileTextLine } from "@remixicon/react";
import useNoteId from "@/hooks/use-note-id";

interface ToolNoteItemPreviewProps {
  noteId: string;
  title: string;
}

const ToolNoteItemPreview = memo(
  ({ noteId, title }: ToolNoteItemPreviewProps) => {
    const { setNoteId } = useNoteId();

    return (
      <button
        className="flex items-center gap-2 rounded-md w-full hover:bg-accent cursor-pointer"
        onClick={() => setNoteId(noteId)}
      >
        <div className="flex justify-center items-center size-8 dark:text-white/80 bg-secondary rounded-lg">
          <RiFileTextLine className="size-5 text-primary" />
        </div>
        <h5 className="flex-1 text-sm text-left font-medium truncate">
          {title}
        </h5>
      </button>
    );
  }
);

ToolNoteItemPreview.displayName = "ToolNoteItemPreview";

export default ToolNoteItemPreview;
