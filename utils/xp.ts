import LEVELS from "./levels";
import User from "@/models/User";

export const addXP = async (userId: string, xpToAdd: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.xp += xpToAdd; // Add XP
  
  //Check if the user is crossing 100 XP and hasn't received RP points yet
  if(user.xp >= 100 && !user.rpGrantedFor100XP) {
    user.rp += 20;
    user.rpClaimed = true;
    console.log("20 RP granted fo crossing 100 XP!");
  }

  const newLevel = getLevelFromXP(user.xp);
  if(newLevel.level > user.level) {
    user.level = newLevel.level;
  }

  await user.save(); // Save changes
  return { newXP: user.xp, newLevel: newLevel.level, levelName: newLevel.name };
};

// Get level from XP
export const getLevelFromXP = (xp: number) => {
  return LEVELS.reduce((prev, curr) => (xp >= curr.xpRequired ? curr : prev));
};
