import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { generateToken } from "@/lib/tokens";
import { sendActivationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: "Your email is already verified." });
  }

  const { rawToken, tokenHash } = generateToken();
  user.verifyEmailTokenHash = tokenHash;
  user.verifyEmailExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const activationUrl = `${request.nextUrl.origin}/verify-email?token=${rawToken}`;

  try {
    await sendActivationEmail(user.email, activationUrl);
  } catch (err) {
    console.error("Failed to resend activation email:", err);
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Verification email sent." });
}
