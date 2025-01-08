// file @/components/connect-twitch-youtube.tsx


import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const ConnectAccount = ({ userId }: { userId: String}) => {
  const { data: session} = useSession()

  const handleConnect = async (platform: string) => {
    await signIn(platform, { callbackUrl: "/platform" });  
  };

  const handleDisconnect = async (platform: string) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/disconnect`)
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold text-2xl mb-4">Your Streaming Platforms</h2>
      <div className="flex gap-4">

      </div>
    </div>
  );
};

export default ConnectAccount;
