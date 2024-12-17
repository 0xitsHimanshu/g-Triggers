"use client"
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Twitch, Youtube } from "lucide-react";

const ConnectAccount = () => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => signIn("twitch")}
        variant={"outline"}
        className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 hover:text-white border-purple-700"
      >
        <Twitch size={16} />
        Connect Twitch
      </Button>
      <Button
        onClick={() => signIn("youtube")}
        variant={"outline"}
        className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 hover:text-white border-red-700"
      >
        <Youtube size={16} />
        Connect YouTube
      </Button>
    </div>
  );
};

export default ConnectAccount;
