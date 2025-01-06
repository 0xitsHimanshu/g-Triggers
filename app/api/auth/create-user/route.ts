import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export default async function POST(request: Request){
    try{
        const { email, name, platform, platformDetails } = await request.json();
        await connectToDatabase();
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        const newUser = new User({ email, name, platform, platformDetails });
        await newUser.save();
        return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    } catch {

    }
}