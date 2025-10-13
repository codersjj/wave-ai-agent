import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  console.log("🚀 ~ AuthLayout ~ session:", session);

  if (session) {
    redirect("/home");
  }
  return <div>AuthLayout{children}</div>;
}
