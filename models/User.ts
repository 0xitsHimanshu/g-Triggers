import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    userData: { type: Object, required: true }, // Entire Supabase user object
    platforms: {
      twitch: {
        connected: { type: Boolean, default: false },
        access_token: { type: String, default: null },
        refresh_token: { type: String, default: null },
        provider_name: { type: String, default: null },
        user_name: { type: String, default: null },
      },
      youtube: {
        connected: { type: Boolean, default: false },
        access_token: { type: String, default: null },
        refresh_token: { type: String, default: null },
        provider_name: { type: String, default: null },
        user_name: { type: String, default: null },
      },
      trovo: {
        connected: { type: Boolean, default: false },
        access_token: { type: String, default: null },
        refresh_token: { type: String, default: null },
        provider_name: { type: String, default: null },
        user_name: { type: String, default: null },
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
