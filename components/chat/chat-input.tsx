import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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
  PromptInputTextarea,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { LucideSettings2, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS } from "@/lib/ai/models";
import { useLocalChat } from "@/hooks/use-local-chat";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AVAILABLE_TOOLS, AvailableToolType } from "@/lib/ai/tools/constant";

interface ChatInputProps {
  chatId: string;
  input: string;
  className?: string;
  messages: UIMessage[];
  status: ChatStatus;
  initialModelId: string;
  setInput: Dispatch<SetStateAction<string>>;
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  stop: () => Promise<void>;
}

const ChatInput = ({
  chatId,
  input,
  className,
  messages,
  status,
  initialModelId,
  setInput,
  setMessages,
  sendMessage,
  stop,
}: ChatInputProps) => {
  const { localModelId, setLocalModelId } = useLocalChat();
  const [toolsOpen, setToolsOpen] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<AvailableToolType | null>(
    null
  );

  const placeholder = "Ask, search or create notes...";

  const selectedModelId = localModelId || initialModelId;

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

  const handleSubmit = (message: PromptInputMessage) => {};

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <PromptInput
        className={cn(
          "divide-y-0 bg-white dark:bg-[#242628] ring ring-border rounded-3xl shadow-md",
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

export default ChatInput;
