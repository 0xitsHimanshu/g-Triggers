import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser"; // Helper to fetch the current user
import { signOut } from "next-auth/react";

export default async function AuthButton() {
  const user = await getCurrentUser(); // Fetch the authenticated user

  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" }); // Signs out the user and redirects
    redirect("/"); // Redirect the user to the home page
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
