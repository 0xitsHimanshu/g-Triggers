import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, name, platform, platformDetails } = await request.json();

    if (!email || !platform || !platformDetails) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = await User.create({
        email,
        name,
        platforms: { [platform]: platformDetails },
        createdAt: new Date(),
      });
    } else {
      // Update the existing user's platform details
      user.platforms[platform] = platformDetails;
      await user.save();
    }

    return NextResponse.json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
