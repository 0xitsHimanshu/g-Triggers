'use client';

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button";
import twitchIcon from "@/public/twitch.svg"
import Image from "next/image";
import { signIn } from "next-auth/react";
import { TwitchIcon, Video, YoutubeIcon } from "lucide-react";

export default function Signup(props: {
  searchParams: Promise<Message>;
}) {
  // const searchParams = await props.searchParams;
  // if ("message" in searchParams) {
  //   return (
  //     <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
  //       <FormMessage message={searchParams} />
  //     </div>
  //   );
  // }

  const handleTwitchSignup = () => {
    console.log("twitch signup");
    signIn("twitc");
  };

  return (
    <>
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
    </>
  );
}