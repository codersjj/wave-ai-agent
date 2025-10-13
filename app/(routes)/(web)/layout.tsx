import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  console.log("🚀 ~ WebLayout ~ session:", session);

  if (session) {
    redirect("/home");
  }

  return <div>WebLayout{children}</div>;
}
