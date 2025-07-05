import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default async function ProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
