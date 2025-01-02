import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword, name });
  await user.save();

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.BASE_URL}/verify-email?email=${email}`;

  await transporter.sendMail({
    to: email,
    subject: "Email Confirmation",
    text: `Please confirm your email by clicking this link: ${verificationLink}`,
  });

  return NextResponse.json({ message: "Signup successful, please verify your email" });
}
