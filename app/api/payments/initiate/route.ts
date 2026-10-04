import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import { Payment } from "@/models/Payment";
import { initiateCollection, normalizeUgandaPhoneE164 } from "@/lib/relworx";
import { getListingFeeUGX, generatePaymentReference } from "@/lib/payments";

const schema = z.object({
  schoolId: z.string().min(1),
  phoneNumber: z.string().trim().min(9, "Enter a valid mobile money number"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "school_rep") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();

  const school = await School.findById(parsed.data.schoolId);
  if (!school || school.submittedBy.toString() !== session.user.id) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  const existingPending = await Payment.findOne({ school: school._id, status: "pending" });
  if (existingPending) {
    return NextResponse.json(
      {
        error: "A payment is already in progress for this school. Check your phone, or wait a moment and try again.",
      },
      { status: 409 }
    );
  }

  let feeUGX: number;
  try {
    feeUGX = getListingFeeUGX();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Payments aren't configured correctly yet. Please try again later." },
      { status: 500 }
    );
  }

  const phoneNumber = normalizeUgandaPhoneE164(parsed.data.phoneNumber);
  const reference = generatePaymentReference();
  const type = school.status === "awaiting_payment" ? "initial" : "renewal";

  const payment = await Payment.create({
    school: school._id,
    user: session.user.id,
    type,
    amountUGX: feeUGX,
    phoneNumber,
    reference,
    status: "pending",
  });

  const result = await initiateCollection({
    reference,
    phoneNumber,
    amountUGX: feeUGX,
    description: `${school.name} — annual listing fee`,
  });

  if (!result.success) {
    payment.status = "failed";
    payment.failureReason = result.message;
    await payment.save();
    return NextResponse.json(
      { error: result.message ?? "Payment request failed. Please try again." },
      { status: 502 }
    );
  }

  payment.providerReference = result.internalReference;
  await payment.save();

  return NextResponse.json({
    reference: payment.reference,
    message: "Check your phone to approve the payment request.",
  });
}
