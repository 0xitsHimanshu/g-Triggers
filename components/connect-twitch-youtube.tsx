"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Twitch, Youtube } from "lucide-react";
import axios from "axios";

const ConnectAccount = () => {
  const { data: session } = useSession();
  

  const handleConnect = async (provider: "twitch" | "youtube") => {
    console.log("signing in...");
    const result = await signIn(provider);
    console.log("signed in successfully...");
    
    if (result && session) {
      // Fetch tokens from session
      const { accessToken, refreshToken } = session;

      // Fetch channel details
      // let details;
      // if (provider === "twitch") {
      //   const { data } = await axios.get("/api/twitch/channel-details", {
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   });
      //   details = data;
      // } else if (provider === "youtube") {
      //   const { data } = await axios.get("/api/youtube/channel-details", {
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   });
      //   details = data;
      // }


      // Send tokens and details to update the user in MongoDB
      await axios.post("/api/update-platform", {
        userId: session.user.id,
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
        <Button
          onClick={() => signIn("youtube")}
          variant={"outline"}
          className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 hover:text-white border-red-700"
        >
          <Youtube size={16} />
          Connect YouTube
        </Button>
      </div>
    </div>
  );
};

export default ConnectAccount;
