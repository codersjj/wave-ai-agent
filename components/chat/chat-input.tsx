import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { ChatStatus, UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { ArrowUpIcon, LucideSettings2, XIcon, BrainIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS } from "@/lib/ai/models";
import { useLocalChat } from "@/hooks/use-local-chat";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AVAILABLE_TOOLS, AvailableToolType } from "@/lib/ai/tools/constant";
import { Button } from "../ui/button";
import { RiSquareFill } from "@remixicon/react";
import { toast } from "sonner";

interface ChatInputProps {
  chatId: string;
  input: string;
  className?: string;
  status: ChatStatus;
  initialModelId: string;
  disabled?: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  stop: () => Promise<void>;
}

const ChatInput = ({
  chatId,
  input,
  className,
  status,
  initialModelId,
  disabled,
  setInput,
  sendMessage,
  stop,
}: ChatInputProps) => {
  const { localModelId, setLocalModelId } = useLocalChat();
  const [toolsOpen, setToolsOpen] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<AvailableToolType | null>(
    null
  );
  const [isDeepThinkMode, setIsDeepThinkMode] = useState<boolean>(false);

  const placeholder = "Ask, search or create notes...";

  const selectedModelId = localModelId || initialModelId;

  const isGenerating = status === "submitted" || status === "streaming";
  const showDeepThinkButton = selectedModelId.includes("gemini");

  const handleSelect = (val: string) => {
    setLocalModelId(val);
  };

  const handleToolBtnClick = (tool: AvailableToolType) => {
    setSelectedTool(tool);
    setToolsOpen(false);
  };

  const handleToolRemove = () => {
    setSelectedTool(null);
  };

  const handleDeepThinkToggle = () => {
    setIsDeepThinkMode(!isDeepThinkMode);
  };

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (disabled) return;

      if (!input.trim()) {
        toast.error("Please type a message");
        return;
      }

      if (!chatId) {
        toast.error("ChatId not found, please reload");
        return;
      }

      if (isGenerating) {
        toast.error(
          "Please wait for the current response to finish or stop it first"
        );
        return;
      }

      // 仅更新浏览器地址栏（不触发 Next.js 的路由导航或重新渲染）
      // Use window.history.replaceState to change the displayed URL without
      // causing Next.js to perform navigation. If you want the app router to
      // handle the route change (and possibly reload layouts/data), use
      // next/navigation's router.push or router.replace instead.
      window.history.replaceState({}, "", `/chat/${chatId}`);

      sendMessage(
        {
          role: "user",
          parts: [
            {
              type: "text",
              text: input,
            },
          ],
        },
        {
          body: {
            selectedModelId: selectedModelId,
            selectedToolName: selectedTool?.toolName ?? null,
            isDeepThink: isDeepThinkMode,
          },
        }
      );

      setInput("");
    },
    [
      disabled,
      input,
      chatId,
      isGenerating,
      sendMessage,
      selectedModelId,
      selectedTool,
      setInput,
      isDeepThinkMode,
    ]
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleStop = async () => {
    await stop();
    toast.info("Generation stopped!");
  };

  return (
    <div>
      <PromptInput
        className={cn(
          "relative divide-y-0 bg-white dark:bg-[#242628] ring ring-border rounded-3xl shadow-md",
          className
        )}
        inputGroupClassName="px-1 rounded-3xl overflow-hidden"
        // style={{
        //   boxShadow: "0 4px 6px -1px #dcfce7, 0 2px 4px -2px #dcfce7",
        // }}
        onSubmit={handleSubmit}
      >
        {/* Selected Tools */}
        {selectedTool && (
          <div className="self-start p-2">
            <div className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs text-primary font-medium bg-primary/10">
              <selectedTool.icon size={12} />
              <span>{selectedTool.name}</span>
              <button
                className="ml-0.5 rounded-sm p-0.5 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={handleToolRemove}
              >
                <XIcon size="12" />
              </button>
            </div>
          </div>
        )}

        <PromptInputTextarea
          className="pt-2 min-h-16 text-sm rounded-3xl"
          placeholder={placeholder}
          autoFocus
          rows={2}
          value={input}
          onChange={handleInputChange}
        />
        <PromptInputFooter>
          <PromptInputTools>
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelect={handleSelect}
            />

            {showDeepThinkButton && (
              <PromptInputButton
                className={`cursor-pointer ${
                  isDeepThinkMode
                    ? "text-primary dark:text-green-200 bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground"
                }`}
                size="sm"
                variant={"outline"}
                onClick={handleDeepThinkToggle}
              >
                <BrainIcon className="size-4" />
                <span>DeepThink</span>
              </PromptInputButton>
            )}

            <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
              <PopoverTrigger asChild>
                <PromptInputButton
                  className="cursor-pointer text-muted-foreground"
                  size="sm"
                  variant="outline"
                >
                  <LucideSettings2 className="size-4" />
                  <span>Tools</span>
                </PromptInputButton>
              </PopoverTrigger>
              <PopoverContent
                className="px-1.5 py-2 w-48 drop-shadow-sm"
                align="start"
              >
                <ul className="space-y-2">
                  {AVAILABLE_TOOLS.map((tool) => {
                    const { toolName, type, name, icon: Icon } = tool;
                    return (
                      <li className="" key={type}>
                        <button
                          className="flex gap-1 items-center p-2 w-full rounded-md text-sm hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => handleToolBtnClick(tool)}
                        >
                          <Icon size={14} />
                          <span className="text-muted-foreground">{name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </PopoverContent>
            </Popover>
          </PromptInputTools>

          {/* Submit Button */}
          {isGenerating ? (
            <StopButton stop={handleStop} />
          ) : (
            <PromptInputSubmit
              className="absolute right-4 bottom-3.5 rounded-full cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
              disabled={!input.trim() || disabled}
              status={status}
            >
              <ArrowUpIcon className="size-6" />
            </PromptInputSubmit>
          )}
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

function ModelSelector(props: {
  selectedModelId: string;
  onSelect: (value: string) => void;
}) {
  const { selectedModelId, onSelect } = props;

  return (
    <>
      <PromptInputModelSelect value={selectedModelId} onValueChange={onSelect}>
        <PromptInputModelSelectTrigger className="border border-solid border-primary/5 cursor-pointer">
          <PromptInputModelSelectValue />
        </PromptInputModelSelectTrigger>
        <PromptInputModelSelectContent>
          {MODEL_OPTIONS.map((model) => (
            <PromptInputModelSelectItem
              className="cursor-pointer"
              key={model.value}
              value={model.value}
            >
              {model.label}
            </PromptInputModelSelectItem>
          ))}
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>
    </>
  );
}

function StopButton({ stop }: { stop: () => Promise<void> }) {
  return (
    <Button
      size={"icon"}
      variant={"default"}
      className="group border rounded-full bg-muted dark:bg-black cursor-pointer"
      onClick={stop}
    >
      <RiSquareFill className="size-3.5 text-black group-hover:text-white dark:text-white" />
    </Button>
  );
}

export default ChatInput;
