import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { checkTransactionStatus } from "@/lib/relworx";
import { applySuccessfulPayment, markPaymentFailed } from "@/lib/payments";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  await connectDB();

  const payment = await Payment.findOne({ reference });
  if (!payment || payment.user.toString() !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (payment.status !== "pending") {
    return NextResponse.json({ status: payment.status });
  }

  if (payment.providerReference) {
    try {
      const enquiryStatus = await checkTransactionStatus(payment.providerReference);
      if (enquiryStatus === "successful") {
        await applySuccessfulPayment(payment, request.nextUrl.origin);
      } else if (enquiryStatus === "failed") {
        await markPaymentFailed(payment, "Payment was not approved.");
      }
    } catch (err) {
      console.error("Relworx status check failed:", err);
    }
  }

  return NextResponse.json({ status: payment.status });
}
