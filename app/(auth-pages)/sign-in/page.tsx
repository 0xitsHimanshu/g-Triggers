'use client';

import { FormMessage, Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { TwitchIcon, Video, YoutubeIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export default  function Login(props: { searchParams: Promise<Message> }) {
    
  return (
    <div className="flex flex-col items-center justify-center gap-6 pt-20 ">
      <h1 className="text-2xl font-medium">Log In</h1>
      <p className="text-sm text-muted-foreground">
        Use your streaming platform to log in
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