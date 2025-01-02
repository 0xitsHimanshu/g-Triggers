import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  isConfirmed: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  platforms: {
    twitch: { type: Object, default: null },
    youtube: { type: Object, default: null },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
