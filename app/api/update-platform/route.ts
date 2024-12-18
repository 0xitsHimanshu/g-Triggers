import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { userId, platform, tokens, details } = await request.json();

    console.log("Fetching data from client")
    console.log(userId, platform, tokens, details);

    if (!userId || !platform || !tokens) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData = {
      [`platforms.${platform}.connected`]: true,
      [`platforms.${platform}.access_token`]: tokens.access_token,
      [`platforms.${platform}.refresh_token`]: tokens.refresh_token,
      [`platforms.${platform}.provider_name`]: platform,
      [`platforms.${platform}.user_name`]: details?.username || null,
    };

    const user = await User.findOneAndUpdate(
      { "userData.id": userId },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating platform:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
