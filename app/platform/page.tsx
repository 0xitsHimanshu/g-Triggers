import ConnectAccount from "@/components/connect-twitch-youtube";
import UserDetails from "@/components/user-Detail";
import { InfoIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PlateformPage() {

  const session = await getServerSession()
  const user = {
    user_metadata: {}
  };

  if (!session) {
    console.log("User is not authenticated");
    redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center pt-5 px-5">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
        </div>
          <UserDetails user={user} />
          <ConnectAccount user={user}/>
        <div >
      </div>
      <div></div>
    </div>
  );
}
