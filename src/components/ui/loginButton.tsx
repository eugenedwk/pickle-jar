"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function LoginButton() {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        <p className="text-sm">Signed in as {session.user.email}</p>
        <Button
          className="bg-pickle-blue rounded px-4 py-2 text-white"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    );
  }
  return <Button onClick={() => signIn("google")}>Sign in with Google</Button>;
}
