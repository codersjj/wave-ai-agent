/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolUIPart } from "ai";
import { getToolStatus } from "./tool-status";

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

  return <div>ToolCall</div>;
};

export default ToolCall;
