import { RiLoader4Fill } from "@remixicon/react";

type LoaderOverlayProps = {
  show: boolean;
  text: string;
};

const LoaderOverlay = ({ show, text = "Loading..." }: LoaderOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center bg-background/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <RiLoader4Fill className="size-16 animate-spin text-primary" />
        <p className="text-sm text-secondary-foreground">{text}</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
