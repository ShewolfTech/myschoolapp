import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import "@/models/District";
import "@/models/User";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const status = request.nextUrl.searchParams.get("status");
  const query = status ? { status } : {};

  const schools = await School.find(query)
    .populate("district", "name")
    .populate("submittedBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ schools });
}
