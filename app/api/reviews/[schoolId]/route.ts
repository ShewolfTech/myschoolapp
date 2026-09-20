import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import { Review } from "@/models/Review";
import { User } from "@/models/User";

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
});

async function getVerifiedParent(userId: string) {
  const user = await User.findById(userId).select("role emailVerified");
  if (!user || user.role !== "parent" || !user.emailVerified) {
    return null;
  }
  return user;
}

// GET: the current user's own review for this school (or null)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { schoolId } = await params;
  await connectDB();

  const review = await Review.findOne({ school: schoolId, user: session.user.id }).lean();
  return NextResponse.json({ review });
}

// POST: create a new review — one per parent per school
export async function POST(
  request: Request,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const parent = await getVerifiedParent(session.user.id);
  if (!parent) {
    return NextResponse.json(
      { error: "Only verified parent accounts can leave reviews." },
      { status: 403 }
    );
  }

  const { schoolId } = await params;
  const school = await School.findOne({ _id: schoolId, status: "approved" });
  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await Review.findOne({ school: schoolId, user: session.user.id });
  if (existing) {
    return NextResponse.json(
      { error: "You've already reviewed this school. Edit your existing review instead." },
      { status: 409 }
    );
  }

  const review = await Review.create({
    school: schoolId,
    user: session.user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment || undefined,
  });

  return NextResponse.json({ review }, { status: 201 });
}

// PATCH: edit the current user's own review
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { schoolId } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();

  const review = await Review.findOneAndUpdate(
    { school: schoolId, user: session.user.id },
    { rating: parsed.data.rating, comment: parsed.data.comment || undefined },
    { new: true }
  );

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review });
}
