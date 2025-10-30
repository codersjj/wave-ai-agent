import { ToolNameEnum } from "@/lib/ai/tools/constant";
import { ToolUIPart } from "ai";
import {
  AlertCircleIcon,
  CircleSlash,
  FileText,
  Globe2Icon,
  GlobeIcon,
  Lightbulb,
  LightbulbIcon,
  SearchIcon,
} from "lucide-react";

export const getToolStatus = (
  toolName: string,
  state: ToolUIPart["state"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output?: any
) => {
  console.log("🚀 ~ getToolStatus ~ toolName:", toolName);
  console.log("🚀 ~ getToolStatus ~ state:", state);
  console.log("🚀 ~ getToolStatus ~ output:", output);

  switch (state) {
    case "input-streaming":
      return { icon: Lightbulb, text: "Preparing request..." };
    case "input-available":
      switch (toolName) {
        case ToolNameEnum.CreateNote:
          return { icon: FileText, text: "Creating note..." };
        case ToolNameEnum.SearchNote:
          return { icon: SearchIcon, text: "Searching note..." };
        case ToolNameEnum.WebSearch:
          return { icon: GlobeIcon, text: "Searching web..." };
        case ToolNameEnum.ExtractWebUrl:
          return { icon: Globe2Icon, text: "Extracting content..." };
        default:
          return { icon: LightbulbIcon, text: "Working..." };
      }
    case "output-available":
      switch (toolName) {
        case ToolNameEnum.CreateNote:
          return { icon: Lightbulb, text: `Result from ${toolName}` };
        case ToolNameEnum.SearchNote:
          const notes = Array.isArray(output?.notes) ? output.notes : [];
          const noteCount = notes.length;
          return {
            icon: SearchIcon,
            text: noteCount
              ? `${noteCount} notes found`
              : "Searched note results",
          };
        case ToolNameEnum.WebSearch:
          return { icon: GlobeIcon, text: "Web search results" };
        case ToolNameEnum.ExtractWebUrl:
          return { icon: Globe2Icon, text: "Extracted content" };
        default:
          return { icon: LightbulbIcon, text: "Done" };
      }
    case "output-error":
      return { icon: AlertCircleIcon, text: "Error occurred" };
    default:
      return { icon: CircleSlash, text: "Unknown" };
  }
};
