type LoaderOverlayProps = {
  show: boolean;
  text: string;
};

const LoaderOverlay = ({ show, text = "Loading..." }: LoaderOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center bg-green-100/50 backdrop-blur-sm">
      {text}
    </div>
  );
};

export default LoaderOverlay;
