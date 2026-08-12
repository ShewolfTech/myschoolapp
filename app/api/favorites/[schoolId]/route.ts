import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { School } from "@/models/School";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { schoolId } = await params;

  await connectDB();

  const school = await School.findOne({ _id: schoolId, status: "approved" });
  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  await User.findByIdAndUpdate(session.user.id, {
    $addToSet: { favorites: schoolId }, // no-op if already favorited
  });

  return NextResponse.json({ favorited: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { schoolId } = await params;

  await connectDB();

  await User.findByIdAndUpdate(session.user.id, {
    $pull: { favorites: schoolId },
  });

  return NextResponse.json({ favorited: false });
}
