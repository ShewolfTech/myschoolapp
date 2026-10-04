import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { verifyWebhookSignature } from "@/lib/relworx";
import { applySuccessfulPayment, markPaymentFailed } from "@/lib/payments";

interface RelworxWebhookPayload {
  status: string; // "success" | "failed" | ...
  message?: string;
  customer_reference: string; // our reference
  internal_reference: string; // Relworx's reference
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  let payload: RelworxWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const signatureHeader = request.headers.get("relworx-signature");
  // Must exactly match the URL you registered with Relworx as your
  // webhook callback URL, including scheme and any trailing slash.
  const webhookUrl = `${request.nextUrl.origin}/api/payments/relworx-webhook`;

  const isValid = verifyWebhookSignature(webhookUrl, signatureHeader, {
    status: payload.status,
    customer_reference: payload.customer_reference,
    internal_reference: payload.internal_reference,
  });

  if (!isValid) {
    console.warn("Relworx webhook signature did not match — ignoring. If this persists, see the comment in lib/relworx.ts verifyWebhookSignature.");
    return NextResponse.json({ received: true });
  }

  await connectDB();

  const payment = await Payment.findOne({ reference: payload.customer_reference });
  if (!payment) {
    console.warn("Relworx webhook for unknown payment reference:", payload.customer_reference);
    return NextResponse.json({ received: true });
  }

  if (payload.status === "success") {
    await applySuccessfulPayment(payment, request.nextUrl.origin);
  } else if (payload.status === "failed") {
    await markPaymentFailed(payment, payload.message);
  }

  return NextResponse.json({ received: true });
}
