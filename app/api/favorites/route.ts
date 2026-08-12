import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/School";
import "@/models/District";

interface PopulatedFavorite {
  _id: { toString(): string };
  name: string;
  slug: string;
  region: string;
  district: { name: string } | null;
  ownershipType: string;
  levels: string[];
  boardingType: string;
  curriculum: string;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).populate({
    path: "favorites",
    match: { status: "approved" }, // don't show favorites that got un-approved later
    select: "name slug region district ownershipType levels boardingType curriculum",
    populate: { path: "district", select: "name" },
  });

  const favorites = ((user?.favorites ?? []) as unknown as PopulatedFavorite[]).map((s) => ({
    id: s._id.toString(),
    name: s.name,
    slug: s.slug,
    region: s.region,
    district: s.district?.name ?? "",
    ownershipType: s.ownershipType,
    levels: s.levels,
    boardingType: s.boardingType,
    curriculum: s.curriculum,
  }));

  return NextResponse.json({ favorites });
}
