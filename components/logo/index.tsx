import Link from "next/link";
import React from "react";

const Logo = (props: { url?: string }) => {
  const { url = "/" } = props;
  return (
    <Link href={url} className="flex justify-center items-center gap-2">
      <div className="flex justify-center items-center size-8 aspect-square rounded-md overflow-hidden text-primary-foreground">
        <img src="/logo.png" alt="Wave AI Agent logo" width={36} height={36} />
      </div>
      {/* <h1 className="text-base font-bold">Wave AI</h1> */}
      <div className="flex-1 text-start text-base font-medium leading-tight">
        <span>Wave AI</span>
      </div>
    </Link>
  );
};

export default Logo;
