import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from "@/lib/passwordValidation";
import { generateToken } from "@/lib/tokens";
import { sendActivationEmail } from "@/lib/email";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE),
  role: z.enum(["parent", "school_rep"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rawToken, tokenHash } = generateToken();

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    verifyEmailTokenHash: tokenHash,
    verifyEmailExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const activationUrl = `${request.nextUrl.origin}/verify-email?token=${rawToken}`;

  try {
    await sendActivationEmail(user.email, activationUrl);
  } catch (err) {
    console.error("Failed to send activation email:", err);
  }

  return NextResponse.json(
    { id: user._id.toString(), email: user.email, role: user.role },
    { status: 201 }
  );
}
