import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import "@/models/District"; // ensure District schema is registered before populate()
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const params = request.nextUrl.searchParams;
  const search = params.get("search")?.trim();
  const region = params.get("region");
  const district = params.get("district"); // district id
  const ownershipType = params.get("ownershipType");
  const level = params.get("level");
  const boardingType = params.get("boardingType");
  const curriculum = params.get("curriculum");

  const query: Record<string, unknown> = { status: "approved" };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (region) query.region = region;
  if (district) query.district = district;
  if (ownershipType) query.ownershipType = ownershipType;
  if (level) query.levels = level;
  if (boardingType) query.boardingType = boardingType;
  if (curriculum) query.curriculum = curriculum;

  const schools = await School.find(query)
    .select("name slug region district ownershipType levels boardingType curriculum")
    .populate("district", "name")
    .sort({ name: 1 })
    .lean();

  return NextResponse.json({
    count: schools.length,
    schools: schools.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      region: s.region,
      district: (s.district as unknown as { name: string })?.name ?? "",
      ownershipType: s.ownershipType,
      levels: s.levels,
      boardingType: s.boardingType,
      curriculum: s.curriculum,
    })),
  });
}
