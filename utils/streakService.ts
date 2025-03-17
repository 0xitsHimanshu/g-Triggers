import { addXP } from "@/utils/xp";

// Utility function to get the "active day" based on the 5:30 AM threshold.
function getActiveDay(date: Date): string {
  const d = new Date(date);
  // If the time is before 5:30 AM, consider it as the previous day.
  if (d.getHours() < 5 || (d.getHours() === 5 && d.getMinutes() < 30)) {
    d.setDate(d.getDate() - 1);
  }
  // Return a string representing the day (YYYY-MM-DD)
  return d.toISOString().split("T")[0];
}

// Call this function during the login process.
export async function updateUserStreak(user: any) {
  const now = new Date();
  const lastActive = user.lastActive || new Date(0);

  // Determine the "active day" for the last login and now.
  const lastActiveDay = getActiveDay(lastActive);
  const currentActiveDay = getActiveDay(now);

  // If the user has already logged in today, skip updating.
  if (currentActiveDay === lastActiveDay) {
    return;
  }

  // Compute the difference in days between logins.
  const lastDate = new Date(lastActiveDay);
  const currentDate = new Date(currentActiveDay);
  const diffDays = Math.floor(
    (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If login is on the consecutive day, increment the streak; otherwise, reset.
  if (diffDays === 1) {
    user.streakCount = (user.streakCount || 0) + 1;
  } else {
    user.streakCount = 1;
  }

  // Check if user reached a 4+ day streak
  if (user.streakCount >= 2) {
    await addXP(user._id, 90); // Reward 90 XP
  }

  // Update max streak if it's the highest so far
  user.maxStreak = Math.max(user.streakCount, user.maxStreak || 0);

  // Update lastActive to now.
  user.lastActive = now;
  await user.save();
}
