/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolUIPart } from "ai";

interface ToolSearchExtractPreviewProps {
  type: ToolUIPart["type"];
  input: any;
  output: any;
}

const ToolSearchExtractPreview = ({
  type,
  input,
  output,
}: ToolSearchExtractPreviewProps) => {
  return <div>ToolSearchExtractPreview</div>;
};

export default ToolSearchExtractPreview;
