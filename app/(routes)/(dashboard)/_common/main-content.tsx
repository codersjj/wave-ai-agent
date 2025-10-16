type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = ({ children }: MainContentProps) => {
  return <div className="w-full overflow-hidden">{children}</div>;
};

export default MainContent;
