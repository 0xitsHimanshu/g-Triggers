// app/api/disconnect/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { userEmail, platform } = body;

    // Validate input
    if (!userEmail || !platform) {
      return NextResponse.json(
        { error: "Email and platform are required" },
        { status: 400 }
      );
    }

    // Verify the user is modifying their own account
    if (session.user?.email !== userEmail) {
      return NextResponse.json(
        { error: "Unauthorized to modify this account" },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the user and remove the platform
    const updateResult = await User.updateOne(
      { email: userEmail },
      { 
        $unset: { [`platforms.${platform}`]: "" },
        $set: { updatedAt: new Date() }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Platform not found or already disconnected" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Successfully disconnected ${platform}`,
      platform
    });

  } catch (error) {
    console.error("Error in disconnect API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}