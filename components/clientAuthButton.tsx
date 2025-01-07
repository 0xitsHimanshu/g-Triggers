"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

type Props = {
  user: { email: string } | null; // User object or null
};

export default function ClientAuthButton({ user }: Props) {
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" }); // Signs out the user and redirects
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <Button onClick={handleSignout} variant="outline">
        Sign out
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
