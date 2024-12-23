// filename: app/api/connectPlatform/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { supabaseUser, platform, platformDetails, action } = await request.json();

    if (!supabaseUser || !supabaseUser.id || !platform || !action) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user in MongoDB
    const user = await User.findOne({ "userData.id": supabaseUser.id });

    if (!user) {
      User.create({
        userData: supabaseUser,
        platforms: {
          [platform]: {
            access_token: platformDetails.access_token,
            refresh_token: platformDetails.refresh_token,
            provider_name: platformDetails.provider_name,
            user_name: platformDetails.user_name,
        }},
      }).then((user) => {
        console.log("User created:", user);
      })
      
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    }

    if (action === "connect") {
      // Update the platforms object to add the platform
      user.platforms[platform] = platformDetails;
    } else if (action === "disconnect") {
      // Remove the platform from the platforms object
      delete user.platforms[platform];
    } else {
      return NextResponse.json(
        { message: "Invalid action" },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json({ message: "Action completed successfully", user });
  } catch (error) {
    console.error("Error processing platform action:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
