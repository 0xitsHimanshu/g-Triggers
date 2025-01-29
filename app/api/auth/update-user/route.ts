import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const { email, platformDetails, platform } = await request.json();
    
    await connectToDatabase();
    
    const result = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          [`platforms.${platform}`]: platformDetails,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: false }
    ).lean();

    if (!result) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: result });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}