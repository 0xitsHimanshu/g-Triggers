// DECLARATION OF ALL SCHEMA AND ITS TYPE
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
  // Fields for the streak system:
  streakCount?: number;
  lastActive?: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  primaryPlatform: { type: String },
  platforms: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  // Fields for tracking streaks:
  streakCount: { type: Number, default: 0 },
  lastActive: { type: Date },
});

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
export default User;
