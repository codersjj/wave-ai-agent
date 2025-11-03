/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolUIPart } from "ai";
import { getToolStatus } from "./tool-status";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, LoaderIcon, LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { ToolTypeEnum } from "@/lib/ai/tools/constant";
import ToolNoteCardPreview from "./tool-note-card-preview";
import useNoteId from "@/hooks/use-note-id";
import ToolNoteItemPreview from "./tool-note-item-preview";
import ToolSearchExtractPreview from "./tool-search-extract-preview";

interface ToolCallProps {
  toolCallId: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  input?: any;
  output?: any;
  errorText?: string;
  isLoading: boolean;
}

const formatToolName = (type: ToolUIPart["type"]) => type.replace("tool-", "");

const ToolLoadingIndicator = React.memo(({ text }: { text: string }) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => setTime((prev) => prev + 1), 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex flex-col gap-2 rounded-md p-4 w-full bg-background/50 shadow-sm">
      <div className="absolute top-2 right-2 text-xs text-primary">{time}s</div>
      <div className="flex items-center gap-2">
        <LoaderIcon className="size-4 animate-spin" />
        <span className="text-sm font-light">{text}</span>
      </div>
      <div className="rounded-full h-1 bg-background/30 overflow-hidden">
        <div className="rounded-full h-full bg-primary animate-progress-bar"></div>
      </div>
    </div>
  );
});

ToolLoadingIndicator.displayName = "ToolLoadingIndicator";

const ToolHeader = React.memo(
  ({
    className,
    collapsible,
    icon: Icon,
    title,
    type,
    ...props
  }: {
    className?: string;
    collapsible?: boolean;
    icon: LucideIcon;
    title?: string;
    type: ToolUIPart["type"];
  }) => {
    const Wrapper = collapsible ? CollapsibleTrigger : "button";

    return (
      <Wrapper
        className={cn(
          "flex justify-between items-center gap-4 p-3 w-full",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title ?? type.slice(5)}</span>
        </div>
        {collapsible && (
          <ChevronDownIcon className="size-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        )}
      </Wrapper>
    );
  }
);

ToolHeader.displayName = "ToolHeader";

const toolOutputRenders: Record<
  ToolUIPart["type"],
  (input: any, output: any) => React.ReactNode
> = {
  [ToolTypeEnum.CreateNote]: (_, output) => {
    const { id, title, content } = output?.data ?? {};
    return (
      <div className="my-1 bg-amber-50">
        <ToolNoteCardPreview noteId={id} title={title} content={content} />
      </div>
    );
  },
  [ToolTypeEnum.SearchNote]: (input, output) => {
    const notes = output?.notes ?? [];

    return (
      <div className="border border-border/40 rounded-lg px-1.5 py-3">
        <p className="mb-2 text-sm">{`Searched for "${input?.query}"`}</p>
        <ul className="flex flex-col gap-1 pt-2 max-h-48 overflow-y-auto">
          {notes.map((note: any) => (
            <li key={note.id}>
              <ToolNoteItemPreview noteId={note.id} title={note.title} />
            </li>
          ))}
        </ul>
      </div>
    );
  },
  [ToolTypeEnum.WebSearch]: (input, output) => (
    <ToolSearchExtractPreview
      type={ToolTypeEnum.WebSearch}
      input={input}
      output={output}
    />
  ),
  [ToolTypeEnum.ExtractWebUrl]: (input, output) => (
    <ToolSearchExtractPreview
      type={ToolTypeEnum.ExtractWebUrl}
      input={input}
      output={output}
    />
  ),
};

const ToolCall = ({
  toolCallId,
  type,
  state,
  input,
  output,
  errorText,
  isLoading,
}: ToolCallProps) => {
  const toolName = formatToolName(type);

  const { icon, text } = getToolStatus(toolName, state, output);

  const renderOutput = () => {
    if (state === "output-available") {
      const render = toolOutputRenders[type];
      return render ? (
        render(input, output)
      ) : (
        <div className="mt-2">{JSON.stringify(output)}</div>
      );
    }

    if (state === "output-error") {
      return <div className="text-destructive">{errorText}</div>;
    }

    return null;
  };

  if (
    isLoading &&
    (state === "input-streaming" || state === "input-available")
  ) {
    return <ToolLoadingIndicator text={text} />;
  }

  if (type === ToolTypeEnum.CreateNote) {
    return (
      <>
        <ToolHeader collapsible={false} icon={icon} title={text} type={type} />
        <div>{renderOutput()}</div>
      </>
    );
  }

  return (
    <Collapsible defaultOpen className="group mb-3">
      <ToolHeader collapsible icon={icon} title={text} type={type} />
      <CollapsibleContent
        className="data-[state=open]:fade-in data-[state=closed]:fade-out-0
          data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2
          data-[state=open]:animate-in data-[state=closed]:animate-out duration-300"
      >
        {renderOutput()}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ToolCall;
