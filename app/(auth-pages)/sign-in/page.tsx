'use client';

import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TwitchIcon, Video, YoutubeIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default  function Login(props: { searchParams: Promise<Message> }) {

  const handleTwitchSignup = () => {
      console.log("twitch signup");
      signIn("twitch");
    };
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <h1 className="text-2xl font-medium">Sign Up / Log In</h1>
      <p className="text-sm text-muted-foreground">
        Use your streaming platform to sign up or log in
      </p>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => signIn("twitch", { callbackUrl: "/platform" })}
          className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700"
        >
          <TwitchIcon size={16} />
          Sign Up with Twitch
        </Button>
        <Button
          onClick={() =>
            signIn("google", { callbackUrl: "/platform" })
          }
          className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700"
        >
          <YoutubeIcon size={16} />
          Sign Up with YouTube
        </Button>
        <Button
          onClick={() => signIn("trovo", { callbackUrl: "/platform" })}
          className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700"
        >
          <Video size={16} />
          Sign Up with Trovo
        </Button>
      </div>
    </div>
  );
}
