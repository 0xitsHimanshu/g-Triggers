import ConnectAccount from "@/components/connect-twitch-youtube";
import UserDetails from "@/components/user-Detail";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PlateformPage() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userData } = await axios.post("http://localhost:3000/api/syncUser", { supabaseUser: user});
  const userId: string = userData.id
  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center pt-5 px-5">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
        </div>
          <UserDetails userData={userData} />
          <ConnectAccount userId={userId}/>
        <div >
      </div>
      <div></div>
    </div>
  );
}
