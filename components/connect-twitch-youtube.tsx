// file @/components/connect-twitch-youtube.tsx

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { Trash, Twitch, Youtube } from "lucide-react";
import {
  ConnectAccountProps,
  PlatformDetails,
  UserMetadata,
} from "@/types/user.types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fetchTwitchData } from "@/utils/twitch";
import { fetchDataFromYoutube, fetchYoutubeData } from "@/utils/youtube";

interface PlatformStats {
  twitch?: {
    display_name: string;
    followers: number;
  };
  youtube?: {
    title: string;
    subscribers: number;
  };
}

const ConnectAccount = ({ user }: ConnectAccountProps) => {
  const [loading, setLoading] = useState(false);
  const [platformStats, setPlatformStats] = useState<any>({});
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Fetch platform stats for connected accounts
    const fetchStats = async () => {
      const platforms = user.user_metadata?.platforms;
      const userId = user.user_metadata?.sub;

      if (platforms?.twitch?.refresh_token) {
        try {
          const twitchData = await fetchTwitchData(
            platforms.twitch.refresh_token,
            userId
          );
          setPlatformStats((prev: any) => ({
            ...prev,
            twitch: {
              display_name: twitchData.display_name,
              followers: twitchData.view_count, // Adjust based on Twitch API response
            },
          }));
        } catch (error) {
          console.error("Error fetching Twitch data:", error);
        }
      }

      if (platforms?.youtube?.access_token) {
        try {
          const youtubeData = await fetchDataFromYoutube(
            platforms.youtube.access_token
          );
          setPlatformStats((prev: PlatformStats) => ({
            ...prev,
            youtube: {
              title: youtubeData.statistics.title, // Adjusting based on API response
              subscribers: parseInt(youtubeData.statistics.subscriberCount, 10), // Converting to number
            },
          }));
        } catch (error) {
          console.error("Error fetching YouTube data:", error);
        }
      }
    };

    fetchStats();
  }, [user]);


  const handleConnect = async (provider: "google" | "twitch") => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // For YouTube, we use Google OAuth
          scopes:
            provider === "google"
              ? "https://www.googleapis.com/auth/youtube.readonly"
              : undefined,
        },
      });

      if (error) {
        console.error(`Error connecting ${provider}:`, error);
        return;
      }

      const { data } = await supabase.auth.getSession();

      // Extract token details from session data
      const platformDetails: PlatformDetails = {
        access_token: data?.session?.access_token,
        refresh_token: data?.session?.refresh_token,
        provider_name: provider,
        user_name: data?.session?.user?.user_metadata.name,
      };

      // Update user_metadata with platform details
      const updatedMetadata: UserMetadata = {
        ...user.user_metadata,
        platforms: {
          ...user.user_metadata?.platforms,
          [provider]: platformDetails,
        },
      };

      const { error: updateError } = await supabase.auth.updateUser({
        data: updatedMetadata,
      });

      // Call the connectPlatform route to save to MongoDB

      await axios.post("http://localhost:3000/api/connectPlatform", {
        supabaseUser: data?.session?.user,
        platform: provider,
        platformDetails,
        action: "connect",
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      } else {
        alert(`${provider} connected successfully!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (provider: "youtube" | "twitch") => {
    setLoading(true);
    try {
      //Remove the provider from the platforms object
      const updatedPlatforms = { ...user.user_metadata?.platforms };
      delete updatedPlatforms[provider];

      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          platforms: updatedPlatforms,
        },
      });

      if (error) console.error(`Error disconnecting ${provider}`, error);
      else alert(`${provider} disconnected successfully!`);

      // Call the disconnectPlatform route to save to MongoDB
      await axios.post("http://localhost:3000/api/connectPlatform", {
        supabaseUser: user,
        platform: provider,
        action: "disconnect",
      });

      router.push("/platform");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold text-2xl mb-4">Your Streaming Platforms</h2>
      <div className="flex gap-4">
        {/* Twitch */}
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={() => handleConnect("twitch")}
            disabled={
              loading || user.user_metadata?.platforms?.twitch !== undefined
            }
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
              <div className="text-sm text-gray-600">
                {platformStats.twitch
                  ? `@${platformStats.twitch.display_name} (${platformStats.twitch.followers} followers)`
                  : "Fetching stats..."}
              </div>
              <Button
                onClick={() => handleDisconnect("twitch")}
                disabled={loading}
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
            onClick={() => handleConnect("google")}
            disabled={
              loading || user.user_metadata?.platforms?.youtube !== undefined
            }
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
              <div className="text-sm text-gray-600">
                {platformStats.youtube
                  ? `${platformStats.youtube.title} (${platformStats.youtube.subscribers} subscribers)`
                  : "Fetching stats..."}
              </div>
              <Button
                onClick={() => handleDisconnect("youtube")}
                disabled={loading}
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
