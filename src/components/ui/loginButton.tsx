"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function LoginButton() {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <div className="flex items-center justify-end space-x-4">
        <Button
          className="bg-pickle-blue rounded px-4 py-2 text-white"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    );
  }
  return <Button onClick={() => signIn("auth0")}>Sign in</Button>;
}
