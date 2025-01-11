// components/connect-twitch-youtube.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Twitch, Youtube, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Platform {
  provider: string;
  access_token?: string;
  refresh_token?: string;
  profile_url?: string;
}

interface UserPlatforms {
  twitch?: Platform;
  google?: Platform; // Changed from youtube to google
}

interface ConnectAccountProps {
  userId: string;
  platforms?: UserPlatforms;
  provider?: string;
}

const ConnectAccount = ({ userId, platforms, provider }: ConnectAccountProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const platformConfig = {
    twitch: {
      name: "Twitch",
      icon: Twitch,
      color: "bg-purple-600 hover:bg-purple-700",
      disconnectColor: "hover:text-purple-600 hover:border-purple-600",
      provider: "twitch"
    },
    google: { // Changed from youtube to google
      name: "YouTube",
      icon: Youtube,
      color: "bg-red-600 hover:bg-red-700",
      disconnectColor: "hover:text-red-600 hover:border-red-600",
      provider: "google" // The actual provider value to use
    }
  };

  const isPlatformConnected = (platform: "twitch" | "google"): boolean => {
    return platform === provider || !!platforms?.[platform]?.access_token;
  };

  const isSignInProvider = (platform: string): boolean => {
    return platform === provider;
  };

  const handleConnect = async (platform: "twitch" | "google") => {
    setError(null);

    // Check if platform is already connected
    if (isPlatformConnected(platform)) {
      setError(`${platformConfig[platform].name} account is already connected`);
      return;
    }

    setIsLoading(platform);
    try {
      await signIn(platform, { callbackUrl: "/platform" });
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      setError(`Failed to connect to ${platformConfig[platform].name}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDisconnect = async (platform: "twitch" | "google") => {
    setError(null);

    // Prevent disconnecting the sign-in provider
    if (isSignInProvider(platform)) {
      toast({
        variant: "destructive",
        title: "Cannot Disconnect",
        description: `Cannot disconnect the platform used for sign-in`,
      });
      return;
    }

    if (!isPlatformConnected(platform)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No ${platformConfig[platform].name} account is connected`,
      });
      return;
    }

    setIsLoading(platform);
    try {
      const response = await axios.post("/api/disconnect", {
        userEmail: userId,
        platform,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: `Successfully disconnected ${platformConfig[platform].name}`,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      
      let errorMessage = `Failed to disconnect from ${platformConfig[platform].name}`;
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <h2 className="font-bold text-xl">Connected Platforms</h2>
      
      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="w-full space-y-4">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const isConnected = isPlatformConnected(platform as "twitch" | "google");
          const isPrimary = isSignInProvider(platform);
          const Icon = config.icon;
          
          return (
            <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6" />
                <span className="font-medium">{config.name}</span>
                {isConnected && (
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Connected
                    </span>
                    {isPrimary && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Sign-in Provider
                      </span>
                    )}
                  </div>
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
                  disabled={isPrimary}
                  title={isPrimary ? "Cannot disconnect sign-in provider" : undefined}
                >
                  {isPrimary ? "Primary Sign-in" : `Disconnect ${config.name}`}
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