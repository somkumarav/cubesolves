import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { auth } from "./auth";

export default async function ProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
