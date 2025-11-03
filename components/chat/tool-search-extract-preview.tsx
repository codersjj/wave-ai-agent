/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolTypeEnum } from "@/lib/ai/tools/constant";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface ToolSearchExtractPreviewProps {
  type: typeof ToolTypeEnum.WebSearch | typeof ToolTypeEnum.ExtractWebUrl;
  input: any;
  output: any;
}

const ToolSearchExtractPreview = ({
  type,
  input,
  output,
}: ToolSearchExtractPreviewProps) => {
  const isWebSearch = type === "tool-webSearch";
  const results = output?.results ?? [];

  const headerText = isWebSearch
    ? `Query: "${input?.query}"`
    : `URLs: "${input?.urls.join(", ")}"`;

  const countText = isWebSearch
    ? `Used ${results.length} sources`
    : `Found ${results.length} pages`;

  const itemText = (item: any) => (isWebSearch ? item.title : item.url);

  return (
    <div className="flex flex-col gap-2 mt-1 border border-border/40 rounded-lg">
      <h5 className="text-sm font-medium">{headerText}</h5>
      <div className="space-y-1">
        <p className="text-sm text-blue-500/80">{countText}</p>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {results.map((item: any, i: number) => (
            <li key={i}>
              <a
                href={item.url}
                rel="noreferrer"
                target="_blank"
                className="flex items-center gap-2 p-1 w-full text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4"
              >
                {item.favicon && (
                  <Image
                    width={16}
                    height={16}
                    alt="favicon"
                    src={item.favicon}
                    className="rounded-md size-4"
                    unoptimized
                  />
                )}
                <p className="text-sm break-all">
                  <span>{itemText(item)} </span>
                  <ExternalLink className="relative bottom-0.5 inline-flex size-3.5" />
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToolSearchExtractPreview;
