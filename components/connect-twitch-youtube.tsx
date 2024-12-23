"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Twitch, Youtube } from "lucide-react";
import axios from "axios";

const ConnectAccount = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();

  const handleConnect = async (provider: "twitch" | "youtube") => {
    const result = await signIn(provider, { redirect: false, callbackUrl: "/" });
    console.log("data send successfully");
    
    if (result && session) {
      // Fetch tokens from session
      const { accessToken, refreshToken } = session;

      // Send tokens and details to update the user in MongoDB
      await axios.post("http://localhost:3000/api/update-platform", {
        userId: userId,
        platform: provider,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
        // details,
      });

    }
  };


  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold text-2xl mb-4">Your Streaming Platforms</h2>
      <div className="flex gap-4">
        <Button
          onClick={() => handleConnect("twitch")}
          variant={"outline"}
          className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 hover:text-white border-purple-700"
        >
          <Twitch size={16} />
          Connect Twitch
        </Button>
        {/* <Button
          onClick={() => signIn("youtube")}
          variant={"outline"}
          className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 hover:text-white border-red-700"
        >
          <Youtube size={16} />
          Connect YouTube
        </Button> */}
      </div>
    </div>
  );
};

export default ConnectAccount;
