import { cn } from "@/lib/utils";

const ThreeDotsAnimation = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div className="flex gap-1">
      <div
        className={cn(
          "rounded-full w-4 h-4 bg-black animate-bounce [animation-delay:-300ms]",
          className
        )}
        style={size ? { width: `${size}px`, height: `${size}px` } : {}}
      ></div>
      <div
        className={cn(
          "rounded-full w-4 h-4 bg-black animate-bounce [animation-delay:-150ms]",
          className
        )}
        style={size ? { width: `${size}px`, height: `${size}px` } : {}}
      ></div>
      <div
        className={cn(
          "rounded-full w-4 h-4 bg-black animate-bounce",
          className
        )}
        style={size ? { width: `${size}px`, height: `${size}px` } : {}}
      ></div>
    </div>
  );
};

export default ThreeDotsAnimation;
