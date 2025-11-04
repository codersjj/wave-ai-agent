import React, { useCallback, useEffect, useRef } from "react";
import { UIMessage } from "ai";
import { Message, MessageContent } from "../ai-elements/message";
import { cn } from "@/lib/utils";
import { Response } from "../ai-elements/response";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../ai-elements/reasoning";
import { ToolTypeEnum } from "@/lib/ai/tools/constant";
import ToolCall from "./tool-call";
import MessageActions from "./message-actions";
import { useFinalizeMessageParts } from "@/features/use-chat";

interface PreviewMessageProps {
  message: UIMessage;
  chatId: string;
  isLoading: boolean;
}

const PreviewMessage = React.memo(
  ({ message, chatId, isLoading }: PreviewMessageProps) => {
    const { id, role, parts } = message;
    const finalizeParts = useFinalizeMessageParts();
    const pendingPartsRef = useRef<UIMessage["parts"] | null>(null);
    // Persist user-set durations across streaming updates
    const reasoningDurationRef = useRef<Map<number, number>>(new Map());

    const handleDurationChange = useCallback(
      (reasoningIndexToUpdate: number, duration: number) => {
        // 只在本地缓存，等待流结束后一次性提交
        if (!id || !parts) return;

        // 重新计算 reasoning 索引，与渲染时保持一致
        let currentReasoningIndex = 0;

        // 创建新的 parts 数组，更新对应 reasoning part 的 duration
        const updatedParts = parts.map((part) => {
          if (part.type === "reasoning") {
            // 如果匹配到要更新的索引，则更新 duration
            if (currentReasoningIndex === reasoningIndexToUpdate) {
              currentReasoningIndex++; // 先自增，然后返回更新后的 part
              return { ...part, duration };
            }
            // 不匹配，只自增索引
            currentReasoningIndex++;
          }
          return part;
        });
        // 记录该 reasoning 索引的最终时长，保证后续流式追加不会覆盖
        reasoningDurationRef.current.set(reasoningIndexToUpdate, duration);
        pendingPartsRef.current = updatedParts;
      },
      [id, parts]
    );

    // 在渲染时计算 reasoning 索引
    let reasoningIndex = 0;

    // 流结束后一次性 finalize：使用合并后的最新 parts，保证 duration 不丢
    useEffect(() => {
      if (!isLoading && id && parts) {
        if (reasoningDurationRef.current.size === 0) return;

        // 在这里重新合并 parts，确保获取到最新的 duration
        let idx = 0;
        const partsToSave = parts.map((part) => {
          if (part.type === "reasoning") {
            const d = reasoningDurationRef.current.get(idx);
            const next = d !== undefined ? { ...part, duration: d } : part;
            idx++;
            return next;
          }
          return part;
        });

        console.log("🚀 ~ partsToSave:", partsToSave);
        finalizeParts.mutate({
          param: { messageId: id },
          json: { chatId, parts: partsToSave },
        });
        // 重置缓存，避免重复提交
        pendingPartsRef.current = null;
        reasoningDurationRef.current.clear();
      }
    }, [isLoading, id, chatId, finalizeParts, parts]);

    return (
      <Message
        from={role}
        key={id}
        className={`flex flex-col gap-2 ${
          message.role === "assistant" ? "items-start" : "items-end"
        }`}
      >
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
                const currentReasoningIndex = reasoningIndex++;
                return (
                  <Reasoning
                    key={`${id}-reason-${currentReasoningIndex}`}
                    isStreaming={isLoading}
                    reasoningIndex={currentReasoningIndex}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    duration={(part as any).duration}
                    onThinkingDurationChange={handleDurationChange}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );

              case ToolTypeEnum.CreateNote:
              case ToolTypeEnum.SearchNote:
              case ToolTypeEnum.WebSearch:
              case ToolTypeEnum.ExtractWebUrl:
                const { input, state, toolCallId, type, output, errorText } =
                  part;
                return (
                  <ToolCall
                    key={toolCallId}
                    toolCallId={toolCallId}
                    type={type}
                    input={input}
                    state={state}
                    output={output}
                    errorText={errorText}
                    isLoading={isLoading}
                  />
                );

              default:
                return null;
            }
          })}
        </MessageContent>
        <MessageActions message={message} isLoading={isLoading} />
      </Message>
    );
  }
);

PreviewMessage.displayName = "PreviewMessage";

export default PreviewMessage;
