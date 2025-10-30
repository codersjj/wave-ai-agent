import React from "react";
import { isTextUIPart, TextUIPart, UIMessage } from "ai";
import { Message, MessageContent } from "../ai-elements/message";
import { cn } from "@/lib/utils";
import { Response } from "../ai-elements/response";
import { useTheme } from "next-themes";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../ai-elements/reasoning";
import { ToolTypeEnum } from "@/lib/ai/tools/constant";
import ToolCall from "./tool-call";

interface PreviewMessageProps {
  message: UIMessage;
  isLoading: boolean;
}

type TextOnlyMessage = Omit<UIMessage, "parts"> & { parts: TextUIPart[] };

function getLastTextPart(message: UIMessage): TextUIPart | null {
  const part = message.parts.at(-1);
  return part && isTextUIPart(part) ? part : null;
}

function getLastText(message: UIMessage): string | null {
  const p = getLastTextPart(message);
  return p ? p.text : null;
}

const PreviewMessage = React.memo(
  ({ message, isLoading }: PreviewMessageProps) => {
    // const { theme } = useTheme()
    const { id, role, parts } = message;

    return (
      <Message from={role} key={id}>
        <MessageContent
          className={cn(
            "text-[15.5px] dark:text-white",
            role === "user"
              ? "p-2.5 text-[14.5px] text-foreground! bg-muted!"
              : "px-1 pb-0 max-w-full bg-transparent!"
          )}
        >
          {parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <Response
                    key={`${id}-${index}`}
                    shikiTheme={["light-plus", "dracula"]}
                  >
                    {part.text}
                  </Response>
                );
              case "reasoning":
                return (
                  <Reasoning
                    key={`${id}-reason-${index}`}
                    isStreaming={isLoading}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );

              case ToolTypeEnum.CreateNote:
                return <ToolCall key={`${id}-tool-${index}`} />;
              case ToolTypeEnum.SearchNote:
                return <ToolCall key={`${id}-tool-${index}`} />;
              case ToolTypeEnum.WebSearch:
                return <ToolCall key={`${id}-tool-${index}`} />;
              case ToolTypeEnum.ExtractWebUrl:
                return <ToolCall key={`${id}-tool-${index}`} />;

              default:
                return null;
            }
          })}
        </MessageContent>
      </Message>
    );
  }
);

PreviewMessage.displayName = "PreviewMessage";

export default PreviewMessage;
