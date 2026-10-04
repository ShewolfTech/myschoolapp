import { createHmac } from "crypto";

const RELWORX_BASE_URL = "https://payments.relworx.com/api";
const RELWORX_API_KEY = process.env.RELWORX_API_KEY;
const RELWORX_ACCOUNT_NO = process.env.RELWORX_ACCOUNT_NO;
const RELWORX_WEBHOOK_KEY = process.env.RELWORX_WEBHOOK_KEY;

function requireConfig() {
  if (!RELWORX_API_KEY || !RELWORX_ACCOUNT_NO) {
    throw new Error(
      "Relworx isn't configured — set RELWORX_API_KEY and RELWORX_ACCOUNT_NO"
    );
  }
}

function headers() {
  return {
    Authorization: `Bearer ${RELWORX_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.relworx.v2",
  };
}

/**
 * Relworx expects the phone number in E.164 format, e.g. +256701345678.
 * Accepts common local input formats (0701345678, 701345678,
 * 256701345678, or already-E.164) and normalizes them.
 */
export function normalizeUgandaPhoneE164(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("256")) return `+${digits}`;
  if (digits.startsWith("0")) return `+256${digits.slice(1)}`;
  return `+256${digits}`;
}

export interface InitiateCollectionParams {
  reference: string; // ours — 8-36 chars, unique
  phoneNumber: string; // E.164, use normalizeUgandaPhoneE164() first
  amountUGX: number;
  description?: string;
}

export interface InitiateCollectionResult {
  success: boolean;
  internalReference?: string; // Relworx's own reference — needed for status checks
  message?: string;
}

export async function initiateCollection(
  params: InitiateCollectionParams
): Promise<InitiateCollectionResult> {
  requireConfig();

  const res = await fetch(`${RELWORX_BASE_URL}/mobile-money/request-payment`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      account_no: RELWORX_ACCOUNT_NO,
      reference: params.reference,
      msisdn: params.phoneNumber,
      currency: "UGX",
      amount: params.amountUGX,
      description: params.description ?? "MySchoolApp Uganda listing fee",
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { success: false, message: data?.message ?? `Relworx request failed: ${res.status}` };
  }

  return {
    success: Boolean(data?.success),
    internalReference: data?.internal_reference,
    message: data?.message,
  };
}

export type EnquiryStatus = "pending" | "successful" | "failed";

export async function checkTransactionStatus(
  internalReference: string
): Promise<EnquiryStatus> {
  requireConfig();

  const url = new URL(`${RELWORX_BASE_URL}/mobile-money/check-request-status`);
  url.searchParams.set("internal_reference", internalReference);
  url.searchParams.set("account_no", RELWORX_ACCOUNT_NO!);

  const res = await fetch(url.toString(), { headers: headers() });

  if (!res.ok) {
    return "pending";
  }

  const data = await res.json().catch(() => ({}));
  const status = (data?.status ?? data?.request_status) as string | undefined;

  if (status === "success" || status === "successful") return "successful";
  if (status === "failed") return "failed";
  return "pending";
}

/**
 * Verifies the Relworx-Signature header on an incoming webhook.
 *
 * Per Relworx's docs: sort the POST body's status/customer_reference/
 * internal_reference fields alphabetically by key, append each key and
 * value (no delimiter) to the exact webhook URL string, then HMAC-SHA256
 * the result with your webhook signing key, hex-encoded.
 *
 * IMPORTANT — this is my best-effort reading of the published algorithm;
 * a couple of specifics (e.g. whether the timestamp itself factors into
 * the signed string, or only appears alongside it) weren't fully
 * unambiguous from the docs. Test this against a real webhook from your
 * Relworx dashboard before trusting it, and log both the computed and
 * received signatures while testing so you can adjust the construction
 * if they don't match. Because the polling fallback in
 * /api/payments/status doesn't depend on this at all (it's an
 * authenticated outbound call, not something a bad actor could spoof),
 * nothing breaks in the meantime if this needs tweaking — the webhook is
 * a speed optimization, not the only path to a confirmed payment.
 */
export function verifyWebhookSignature(
  webhookUrl: string,
  signatureHeader: string | null,
  body: { status: string; customer_reference: string; internal_reference: string }
): boolean {
  if (!RELWORX_WEBHOOK_KEY || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.split("=") as [string, string])
  );
  const providedSignature = parts.v;
  if (!providedSignature) return false;

  const sortedKeys = ["customer_reference", "internal_reference", "status"] as const;
  let signedString = webhookUrl;
  for (const key of sortedKeys) {
    signedString += key + body[key];
  }

  const computedSignature = createHmac("sha256", RELWORX_WEBHOOK_KEY)
    .update(signedString)
    .digest("hex");

  return computedSignature === providedSignature;
}
