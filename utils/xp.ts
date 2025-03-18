import LEVELS from "./levels";
import User from "@/models/User";

export const addXP = async (userId: string, xpToAdd: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.xp += xpToAdd; // Add XP
  const newLevel = getLevelFromXP(user.xp); // Check new level

  if (newLevel.level > user.level) {
    user.level = newLevel.level; // Update level if it increased
    user.levelName = newLevel.name; // Update level name
  }

  await user.save(); // Save changes
  return { newXP: user.xp, newLevel: newLevel.level, levelName: newLevel.name };
};

// Get level from XP
export const getLevelFromXP = (xp: number) => {
  return LEVELS.reduce((prev, curr) => (xp >= curr.xpRequired ? curr : prev));
};
