import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from "@/lib/passwordValidation";
import { hashToken } from "@/lib/tokens";
import { sendPasswordChangedEmail } from "@/lib/email";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();

  const tokenHash = hashToken(parsed.data.token);

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordTokenHash +resetPasswordExpires");

  if (!user) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  user.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  try {
    await sendPasswordChangedEmail(user.email);
  } catch (err) {
    console.error("Failed to send password-changed notification:", err);
  }

  return NextResponse.json({ message: "Password reset successfully." });
}
