import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// POST handler for /api/syncUser
export async function POST(request: Request) {
  try {
    const { supabaseUser } = await request.json();

    if (!supabaseUser || !supabaseUser.id) {
      return NextResponse.json(
        { message: "Invalid user data" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Add the platforms object to the user data
    const platforms = {
      twitch: { connected: false },
      youtube: { connected: false },
      trovo: { connected: false },
    };

    // Check if the user already exists in MongoDB
    let user = await User.findOne({ "userData.id": supabaseUser.id });

    if (!user) {
      user = await User.create({
        userData: supabaseUser,
        platforms,
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
