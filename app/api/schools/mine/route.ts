import { NextRequest, NextResponse } from "next/server";
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

async function getSessionUser() {
  const session = await auth();
  if (!session?.user || session.user.role !== "school_rep") return null;
  return session.user;
}

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(sessionUser.id).populate({
    path: "managedSchools",
    populate: { path: "district", select: "name" },
    options: { sort: { createdAt: -1 } },
  });

  return NextResponse.json({ schools: user?.managedSchools ?? [] });
}

// POST: create a new school as "awaiting_payment" — it only enters the
// admin review queue once the listing fee is paid (see lib/payments.ts).
export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(sessionUser.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.emailVerified) {
    return NextResponse.json(
      { error: "Please verify your email before registering a school." },
      { status: 403 }
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
    status: "awaiting_payment",
    submittedBy: user._id,
  });

  user.managedSchools.push(school._id);
  await user.save();

  // No admin notification here — that happens once the listing fee is
  // paid and the school moves to "pending" (lib/payments.ts).

  return NextResponse.json({ school }, { status: 201 });
}
