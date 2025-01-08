import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { userEmail, platform } = await request.json();

    await connectToDatabase();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.platforms[platform]) {
      delete user.platforms[platform];
      await user.save();
    }

    return NextResponse.json({ message: "Platform disconnected successfully", user });
  } catch (error) {
    return NextResponse.json({ message: "Error disconnecting platform", error }, { status: 500 });
  }
}
