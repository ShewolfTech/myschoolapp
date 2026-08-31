import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashToken } from "@/lib/tokens";

const schema = z.object({
  token: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await connectDB();

  const tokenHash = hashToken(parsed.data.token);

  const user = await User.findOne({
    verifyEmailTokenHash: tokenHash,
    verifyEmailExpires: { $gt: new Date() },
  }).select("+verifyEmailTokenHash +verifyEmailExpires");

  if (!user) {
    return NextResponse.json(
      { error: "This verification link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  user.emailVerified = new Date();
  user.verifyEmailTokenHash = undefined;
  user.verifyEmailExpires = undefined;
  await user.save();

  return NextResponse.json({ message: "Email verified successfully." });
}
