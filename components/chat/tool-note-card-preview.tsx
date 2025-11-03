import useNoteId from "@/hooks/use-note-id";
import React, { memo } from "react";

interface ToolNoteCardPreviewProps {
  noteId: string;
  title: string;
  content: string;
}

const ToolNoteCardPreview = memo(
  ({ noteId, title, content }: ToolNoteCardPreviewProps) => {
    const { setNoteId } = useNoteId();

    const handleClick = () => {
      handleButtonAction();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // see: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role#required_javascript_features
      if (e.key !== "Enter" && e.key !== " ") return;

      handleButtonAction();
    };

    const handleButtonAction = () => setNoteId(noteId);
    return (
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col gap-2 border border-border rounded-md p-4
        bg-muted shadow-sm hover:shadow-md cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <h5 className="text-sm font-medium line-clamp-1">{title}</h5>
        <p className="text-xs text-muted-foreground font-light line-clamp-3">
          {content}
        </p>
      </div>
    );
  }
);

ToolNoteCardPreview.displayName = "ToolNoteCardPreview";

export default ToolNoteCardPreview;
