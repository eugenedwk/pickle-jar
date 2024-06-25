"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();
  console.log("session", session);
  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        <p className="text-sm">Signed in as {session.user.email}</p>
        <button
          className="bg-pickle-blue rounded px-4 py-2 text-white"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button
      className="bg-pickle-green rounded px-4 py-2 text-white"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
