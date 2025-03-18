import mongoose, { Schema, Document } from "mongoose";

export interface PlatformDetails {
  provider: string;
  access_token: string;
  refresh_token: string;
  profile_url: string;
}

export interface UserDocument extends Document {
  email: string;
  name: string;
  primaryPlatform: string;
  platforms: Record<string, PlatformDetails>;
  createdAt: Date;
  // New fields for the streak system:
  streakCount?: number;
  lastActive?: Date;
  maxStreak?: number;
  // New fields for XP and leveling system:
  xp: number;
  level: number;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  primaryPlatform: { type: String },
  platforms: { type: Object, default: {} },
  createdAt: { type: Date, default: () => new Date() },
  // New fields for tracking streaks:
  streakCount: { type: Number, default: 0 },
  lastActive: { type: Date },
  maxStreak: { type: Number, default: 0 },
  // XP and level system:
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
export default User;
