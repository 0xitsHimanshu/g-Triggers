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
  platforms: Record<string, PlatformDetails>;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  platforms: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
export default User;
