import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { District } from "@/models/District";

export async function GET(request: NextRequest) {
  await connectDB();

  const region = request.nextUrl.searchParams.get("region");

  const query = region ? { region } : {};
  const districts = await District.find(query).sort({ name: 1 }).lean();

  return NextResponse.json({
    districts: districts.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      region: d.region,
    })),
  });
}
