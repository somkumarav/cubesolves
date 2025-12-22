import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { auth } from "@/auth";
import ReactQueryClientProvider from "./react-query-wrapper";

export default async function ProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
    </SessionProvider>
  );
}
