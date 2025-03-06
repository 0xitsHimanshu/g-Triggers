import { InfoIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import UserDetails from "@/components/user-Detail";
import ConnectAccount from "@/components/connect-twitch-youtube";
import UserProfile from "@/components/user-data";
<<<<<<< Updated upstream
=======
import DragAndDropButton from "@/components/dragAndDropBtn";
import CountdownTimer from "@/components/countdownTimer";
>>>>>>> Stashed changes

export default async function DashboardPage() {
  // Retrieve the session
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("User is not authenticated");
    redirect("/sign-in");
  }
  
  // Fetch user data from MongoDB
  await connectToDatabase();
  const userDoc = await User.findOne({ email: session.user?.email });
  
  if (!userDoc) {
    console.error("User not found in database");
    redirect("/sign-up");
  }

  const user = JSON.parse(JSON.stringify(userDoc));

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center pt-5 px-5">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <UserDetails user={user} />

      {/* New section to display the user's streak */}
      <div className="w-full text-center">
        <p className="text-xl font-semibold">
          Current Streak: {user.streakCount || 0} {user.streakCount === 1 ? "day" : "days"}
        </p>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer />

      <ConnectAccount userId={user.email} platforms={user.platforms} primaryProvider={user.primaryPlatform} />
      <UserProfile user={user} />
    </div>
  );
}
