import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from "@/lib/tokens";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a link to reset your password.";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: parsed.data.email });

  // Always return the same response whether or not the user exists —
  // otherwise this endpoint could be used to check which emails are registered.
  if (!user) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const { rawToken, tokenHash } = generateToken();

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${request.nextUrl.origin}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
