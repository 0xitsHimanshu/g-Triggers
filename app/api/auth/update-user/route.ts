import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User"; 

export async function PUT(request: Request) {
  try {
    const { email, platformDetails, platform } = await request.json();

    if (!email || !platform || !platformDetails) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch user data
    const existingUser = await User.findOne({ email }).lean() as any;

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent primary platform from being removed
    if (
      existingUser.primaryPlatform === platform &&
      !platformDetails.access_token // If access_token is missing, it means user is trying to remove the platform
    ) {
      return NextResponse.json(
        { error: "You cannot disconnect your primary platform." },
        { status: 400 }
      );
    }

    // Update user platform details
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          [`platforms.${platform}`]: platformDetails,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: false }
    ).lean();

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
