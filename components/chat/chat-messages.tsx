import { ChatStatus, TextUIPart, UIMessage } from "ai";
import { useStickToBottom } from "use-stick-to-bottom";
import { Conversation, ConversationContent } from "../ai-elements/conversation";
import { Message, MessageContent } from "../ai-elements/message";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, Ellipsis } from "lucide-react";
import { RiCircleFill } from "@remixicon/react";
import PreviewMessage from "./preview-message";
import ThreeDotsAnimation from "../ui/three-dots-animation";

interface ChatMessagesProps {
  chatId?: string;
  messages: UIMessage[];
  status: ChatStatus;
  error?: Error;
  isLoading: boolean;
}

const ChatMessages = ({
  chatId,
  messages,
  status,
  error,
  isLoading,
}: ChatMessagesProps) => {
  console.log("🚀 ~ ChatMessages ~ messages:", messages);
  // see: https://github.com/stackblitz-labs/use-stick-to-bottom?tab=readme-ov-file#usesticktobottom-hook
  const { scrollRef, contentRef } = useStickToBottom();

  return (
    <div className="overflow-auto" ref={scrollRef}>
      <div ref={contentRef}>
        <Conversation className="min-h-[calc(100vh-157px)]">
          <ConversationContent className="mx-auto md:max-w-3xl">
            {isLoading ? (
              // when going to the single chat page and fetching the previous messages/history of the chat
              <LoadingMessages />
            ) : messages.length === 0 ? (
              <Greeting />
            ) : (
              // Preview Message
              messages.map((message, index) => (
                <PreviewMessage
                  key={message.id}
                  message={message}
                  isLoading={
                    status === "streaming" && messages.length - 1 === index
                  }
                />
              ))
            )}

            {status === "submitted" &&
              messages.length &&
              messages.at(-1)?.role === "user" && (
                <RiCircleFill className="w-4 h-4 animate-bounce" />
              )}

            {status === "streaming" &&
              messages.length &&
              messages.at(-1)?.role === "assistant" && (
                <ThreeDotsAnimation size={8} />
              )}

            {status === "error" && error && (
              <ErrorAlert title="Chat Error" description={error.message} />
            )}
          </ConversationContent>
        </Conversation>
      </div>
    </div>
  );
};

function LoadingMessages() {
  return (
    <div className="flex space-x-3 mt-5">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="w-full space-y-2">
        <Skeleton className="w-8/12 h-8 rounded-lg" />
        <Skeleton className="w-full h-8 rounded-lg" />
      </div>
    </div>
  );
}

function Greeting() {
  return (
    <div className="flex flex-col gap-4 md:mt-3 px-2">
      <p className="text-4xl font-semibold opacity-0 fade-in-up">
        Hello there!
      </p>
      <p className="text-2xl text-zinc-500 opacity-0 fade-in-up [animation-delay:800ms]!">
        How can I help you today?
      </p>
    </div>
  );
}

function ErrorAlert({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Alert
      variant={"destructive"}
      className="border-destructive/50 bg-destructive/10"
    >
      <AlertCircleIcon className="w-4! h-4!" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="whitespace-break-spaces">
        {description}
      </AlertDescription>
    </Alert>
  );
}

export default ChatMessages;
