// file @/components/connect-twitch-youtube.tsx

import { Button } from "./ui/button";
import { Trash, Twitch, Youtube } from "lucide-react";
import {
  ConnectAccountProps,
  PlatformDetails,
  UserMetadata,
} from "@/types/user.types";



const ConnectAccount = ({ user }: ConnectAccountProps) => {

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold text-2xl mb-4">Your Streaming Platforms</h2>
      <div className="flex gap-4">
        {/* Twitch */}
        <div className="flex flex-col gap-2 items-center">
          <Button
            variant={"outline"}
            className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 hover:text-white border-purple-700"
          >
            <Twitch size={16} />
            {user.user_metadata?.platforms?.twitch
              ? "Twitch Connected"
              : "Connect Twitch"}
          </Button>
          {user.user_metadata?.platforms?.twitch && (
            <>
              <Button
                variant={"outline"}
                className="flex items-center gap-2 text-red-600 border-red-700 hover:bg-red-100"
              >
                <Trash size={16} />
                Disconnect Twitch
              </Button>
            </>
          )}
        </div>

        {/* YouTube */}
        <div className="flex flex-col gap-2 items-center">
          <Button
            variant={"outline"}
            className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 hover:text-white border-red-700"
          >
            <Youtube size={16} />
            {user.user_metadata?.platforms?.youtube
              ? "YouTube Connected"
              : "Connect YouTube"}
          </Button>
          {user.user_metadata?.platforms?.youtube && (
            <>
              <Button
                variant={"outline"}
                className="flex items-center gap-2 text-red-600 border-red-700 hover:bg-red-100"
              >
                <Trash size={16} />
                Disconnect YouTube
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectAccount;
