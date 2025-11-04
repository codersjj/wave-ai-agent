import { CopyIcon, LucideIcon, SaveIcon } from "lucide-react";
import { Action, Actions } from "../ai-elements/actions";
import { UIMessage } from "ai";
import { toast } from "sonner";
import { useCreateNote } from "@/features/use-notes";

interface MessageActionsProps {
  message: UIMessage;
  isLoading: boolean;
}

type Action = {
  icon: LucideIcon;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (val?: any) => void;
};

const MessageActions = ({ message, isLoading }: MessageActionsProps) => {
  const { mutateAsync } = useCreateNote();

  if (message.role !== "assistant" || isLoading) return null;

  const getText = () =>
    message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n")
      .trim();

  const handleCopy = async () => {
    const text = getText();
    if (!text) {
      toast.error("No text to copy!");
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleSave = async () => {
    const text = getText();
    if (!text) {
      toast.error("No text to save!");
      return;
    }
    toast.promise(
      mutateAsync({
        title: "Untitled",
        content: text,
        from: 'chat'
      }),
      {
        loading: "Saving note...",
        success: (data) => {
          return "Note saved!";
        },
        error: "Failed to save note",
      }
    );
  };

  const actions: Action[] = [
    {
      icon: CopyIcon,
      label: "Copy",
      onClick: handleCopy,
    },
    {
      icon: SaveIcon,
      label: "Save as a note",
      onClick: handleSave,
    },
  ];

  return (
    <Actions>
      {actions.map(({ icon: Icon, label, onClick: handleClick }) => (
        <Action
          className="cursor-pointer"
          key={label}
          label={label}
          tooltip={label}
          onClick={handleClick}
        >
          <Icon className="size-4" />
        </Action>
      ))}
    </Actions>
  );
};

export default MessageActions;
