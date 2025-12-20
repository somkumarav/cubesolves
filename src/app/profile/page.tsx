"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const session = useSession();
  return (
    <div>
      <p>{JSON.stringify(session.data?.user)}</p>
      <Button onClick={() => signOut()}>signOut</Button>
    </div>
  );
}
