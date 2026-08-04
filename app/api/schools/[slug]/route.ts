import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import "@/models/District";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;

  const school = await School.findOne({ slug, status: "approved" })
    .populate("district", "name")
    .lean();

  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json({
    school: {
      id: school._id.toString(),
      name: school.name,
      slug: school.slug,
      region: school.region,
      district: (school.district as unknown as { name: string })?.name ?? "",
      subCounty: school.subCounty,
      address: school.address,
      ownershipType: school.ownershipType,
      levels: school.levels,
      boardingType: school.boardingType,
      curriculum: school.curriculum,
      foundedYear: school.foundedYear,
      description: school.description,
      facilities: school.facilities,
      images: school.images,
      contact: school.contact,
      feeStructure: school.feeStructure,
      verifiedAt: school.verifiedAt,
    },
  });
}
