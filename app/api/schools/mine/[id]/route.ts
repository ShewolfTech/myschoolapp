import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { School, OWNERSHIP_TYPES, SCHOOL_LEVELS, BOARDING_TYPES, CURRICULUM_TYPES } from "@/models/School";
import { User } from "@/models/User";
import "@/models/District";

const feeItemSchema = z.object({
  level: z.string().trim().min(1),
  term: z.enum(["Term 1", "Term 2", "Term 3", "Annual"]),
  category: z.string().trim().min(1),
  amountUGX: z.number().min(0),
  notes: z.string().trim().optional(),
});

const schoolInputSchema = z.object({
  name: z.string().trim().min(2),
  region: z.enum(["Central", "Eastern", "Northern", "Western"]),
  district: z.string().min(1),
  subCounty: z.string().trim().optional(),
  address: z.string().trim().optional(),
  ownershipType: z.enum(OWNERSHIP_TYPES),
  levels: z.array(z.enum(SCHOOL_LEVELS)).min(1),
  boardingType: z.enum(BOARDING_TYPES),
  curriculum: z.enum(CURRICULUM_TYPES),
  foundedYear: z.number().int().optional(),
  moeRegistrationNumber: z.string().trim().optional(),
  description: z.string().trim().optional(),
  facilities: z.array(z.string().trim()).default([]),
  images: z.array(z.string().url()).max(3).default([]),
  video: z.string().url().optional().or(z.literal("")),
  contact: z.object({
    phone: z.string().trim().min(6),
    email: z.string().trim().email().optional().or(z.literal("")),
    website: z.string().trim().optional(),
  }),
  feeStructure: z.array(feeItemSchema).default([]),
});

async function assertOwnership(userId: string, schoolId: string) {
  const user = await User.findById(userId).select("managedSchools");
  return user?.managedSchools?.some((id: { toString(): string }) => id.toString() === schoolId) ?? false;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "school_rep") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const owns = await assertOwnership(session.user.id, id);
  if (!owns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const school = await School.findById(id).populate("district", "name").lean();
  if (!school) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ school });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "school_rep") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const owns = await assertOwnership(session.user.id, id);
  if (!owns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = schoolInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const school = await School.findByIdAndUpdate(
    id,
    {
      ...data,
      contact: { ...data.contact, email: data.contact.email || undefined },
      status: "pending",
      rejectionReason: undefined,
      verifiedAt: undefined,
    },
    { new: true }
  );

  return NextResponse.json({ school });
}
