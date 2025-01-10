// components/connect-twitch-youtube.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Twitch, Youtube, Loader2 } from "lucide-react";
import axios from "axios";

interface Platform {
  provider: string;
  access_token?: string;
  refresh_token?: string;
  profile_url?: string;
}

interface UserPlatforms {
  twitch?: Platform;
  youtube?: Platform;
}

interface ConnectAccountProps {
  userId: string;
  platforms?: UserPlatforms;
}

const ConnectAccount = ({ userId, platforms }: ConnectAccountProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const platformConfig = {
    twitch: {
      name: "Twitch",
      icon: Twitch,
      color: "bg-purple-600 hover:bg-purple-700",
      disconnectColor: "hover:text-purple-600 hover:border-purple-600"
    },
    youtube: {
      name: "YouTube",
      icon: Youtube,
      color: "bg-red-600 hover:bg-red-700",
      disconnectColor: "hover:text-red-600 hover:border-red-600"
    }
  };

  const handleConnect = async (provider: "twitch" | "google") => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/platform" });
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDisconnect = async (provider: "twitch" | "google") => {
    setIsLoading(provider);
    try {
      await axios.post("/api/disconnect", {
        userEmail: userId,
        platform: provider,
      });
      window.location.reload();
    } catch (error) {
      console.error(`Error disconnecting from ${provider}:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <h2 className="font-bold text-xl">Connected Platforms</h2>
      
      <div className="w-full space-y-4">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const isConnected = platforms?.[platform as keyof UserPlatforms];
          const Icon = config.icon;
          
          return (
            <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6" />
                <span className="font-medium">{config.name}</span>
                {isConnected && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Connected
                  </span>
                )}
              </div>
              
              {isLoading === platform ? (
                <Button disabled variant="ghost">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </Button>
              ) : isConnected ? (
                <Button
                  onClick={() => handleDisconnect(platform as "twitch" | "google")}
                  variant="outline"
                  className={config.disconnectColor}
                >
                  Disconnect {config.name}
                </Button>
              ) : (
                <Button
                  onClick={() => handleConnect(platform as "twitch" | "google")}
                  className={config.color}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  Connect {config.name}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectAccount;