import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  image: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.name = parsed.data.name;
  user.image = parsed.data.image || undefined; // empty string = revert to default avatar
  await user.save();

  return NextResponse.json({ name: user.name, image: user.image ?? null });
}
