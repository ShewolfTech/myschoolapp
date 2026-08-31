import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import { User } from "@/models/User";
import { sendSchoolApprovedEmail, sendSchoolRejectedEmail } from "@/lib/email";

const decisionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().trim().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = decisionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  if (parsed.data.status === "rejected" && !parsed.data.rejectionReason) {
    return NextResponse.json(
      { error: "Please provide a reason for rejecting this submission" },
      { status: 400 }
    );
  }

  await connectDB();

  const school = await School.findByIdAndUpdate(
    id,
    {
      status: parsed.data.status,
      rejectionReason: parsed.data.status === "rejected" ? parsed.data.rejectionReason : undefined,
      verifiedAt: parsed.data.status === "approved" ? new Date() : undefined,
    },
    { new: true }
  );

  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  const rep = await User.findById(school.submittedBy).select("email");

  try {
    if (rep) {
      if (parsed.data.status === "approved") {
        const schoolUrl = `${request.nextUrl.origin}/schools/${school.slug}`;
        await sendSchoolApprovedEmail(rep.email, school.name, schoolUrl);
      } else {
        const editUrl = `${request.nextUrl.origin}/register-school/${school._id.toString()}/edit`;
        await sendSchoolRejectedEmail(
          rep.email,
          school.name,
          parsed.data.rejectionReason ?? "",
          editUrl
        );
      }
    }
  } catch (err) {
    console.error("Failed to notify school rep of decision:", err);
  }

  return NextResponse.json({ school });
}
