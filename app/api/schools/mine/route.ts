import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
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
  district: z.string().min(1), // District ObjectId
  subCounty: z.string().trim().optional(),
  address: z.string().trim().optional(),
  ownershipType: z.enum(OWNERSHIP_TYPES),
  levels: z.array(z.enum(SCHOOL_LEVELS)).min(1),
  boardingType: z.enum(BOARDING_TYPES),
  curriculum: z.enum(CURRICULUM_TYPES),
  foundedYear: z.number().int().optional(),
  description: z.string().trim().optional(),
  facilities: z.array(z.string().trim()).default([]),
  contact: z.object({
    phone: z.string().trim().min(6),
    email: z.string().trim().email().optional().or(z.literal("")),
    website: z.string().trim().optional(),
  }),
  feeStructure: z.array(feeItemSchema).default([]),
});

async function getSessionUser() {
  const session = await auth();
  if (!session?.user || session.user.role !== "school_rep") {
    return null;
  }
  return session.user;
}

// GET: fetch the school_rep's own school (any status), or null if they haven't registered one yet
export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(sessionUser.id).populate({
    path: "managedSchools",
    populate: { path: "district", select: "name" },
  });

  const school = user?.managedSchools?.[0] ?? null;

  return NextResponse.json({ school });
}

// POST: create a new school (only if the rep doesn't already have one)
export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(sessionUser.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.managedSchools.length > 0) {
    return NextResponse.json(
      { error: "You've already registered a school. Edit it instead of creating a new one." },
      { status: 409 }
    );
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
  const baseSlug = slugify(data.name, { lower: true, strict: true });
  let slug = baseSlug;
  let suffix = 1;
  while (await School.findOne({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const school = await School.create({
    ...data,
    contact: { ...data.contact, email: data.contact.email || undefined },
    slug,
    status: "pending",
    submittedBy: user._id,
  });

  user.managedSchools.push(school._id);
  await user.save();

  return NextResponse.json({ school }, { status: 201 });
}

// PATCH: edit the rep's own school — always resets status to "pending" for re-review
export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(sessionUser.id);
  const schoolId = user?.managedSchools?.[0];
  if (!schoolId) {
    return NextResponse.json({ error: "You haven't registered a school yet" }, { status: 404 });
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
    schoolId,
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
