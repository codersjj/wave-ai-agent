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

  if (
    isLoading &&
    (state === "input-streaming" || state === "input-available")
  ) {
    return <ToolLoadingIndicator text={text} />;
  }

  if (type === ToolTypeEnum.CreateNote) {
    return (
      <>
        <ToolHeader
          collapsible={false}
          icon={icon}
          title={toolName}
          type={type}
        />
        <div>{/* Output */}</div>
      </>
    );
  }

  return (
    <Collapsible defaultOpen className="group">
      <ToolHeader collapsible icon={icon} title={toolName} type={type} />
      <CollapsibleContent
        className="data-[state=open]:fade-in data-[state=closed]:fade-out-0
          data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2
          data-[state=open]:animate-in data-[state=closed]:animate-out duration-300"
      >
        {/* Output */}
        content
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ToolCall;
