import { FC } from "react";
import {
  RemixiconComponentType,
  RiAddLine,
  RiFileTextLine,
  RiLoader2Line,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: RemixiconComponentType;
  iconClassName?: string;
  buttonText?: string;
  isLoading?: boolean;
  onButtonClick?: () => void;
};

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = RiFileTextLine,
  iconClassName,
  buttonText = "Create",
  isLoading,
  onButtonClick,
}) => {
  return (
    <div className="text-center py-12">
      <Icon
        className={cn(
          "mx-auto mb-4 size-16 text-muted-foreground",
          iconClassName
        )}
      />
      <h3 className="mb-3 text-lg font-medium">{title}</h3>
      {description && (
        <p className="mb-6 text-muted-foreground">{description}</p>
      )}
      {onButtonClick && (
        <Button
          className="cursor-pointer"
          size={"lg"}
          disabled={isLoading}
          onClick={onButtonClick}
        >
          {isLoading && <RiLoader2Line className="size-4 animate-spin" />}
          <RiAddLine className="size-4" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
