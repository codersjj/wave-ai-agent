import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { RiLoader5Fill } from "@remixicon/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import MainContent from "./_common/main-content";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  console.log("🚀 ~ DashboardLayout ~ session:", session);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <RiLoader5Fill className="w-16 h-16 animate-spin text-primary" />
        </div>
      }
    >
      <NuqsAdapter>
        <SidebarProvider>
          {/* App sidebar */}
          <AppSidebar />

          <SidebarInset
          // className="relative overflow-x-hidden pt-0"
          >
            <MainContent>{children}</MainContent>
          </SidebarInset>
        </SidebarProvider>
      </NuqsAdapter>
    </Suspense>
  );
}
