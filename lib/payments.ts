import { randomBytes } from "crypto";
import type { HydratedDocument } from "mongoose";
import { School } from "@/models/School";
import { User } from "@/models/User";
import { IPayment } from "@/models/Payment";
import { sendNewSchoolNotificationToAdmins } from "@/lib/email";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function getListingFeeUGX(): number {
  const raw = process.env.SCHOOL_LISTING_FEE_UGX;
  const parsed = raw ? Number(raw) : NaN;
  if (!raw || Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(
      "SCHOOL_LISTING_FEE_UGX is not set to a valid positive number in your environment variables."
    );
  }
  return parsed;
}

/**
 * Relworx requires references to be 8-36 characters and unique.
 */
export function generatePaymentReference(): string {
  return `MSA-${Date.now()}-${randomBytes(4).toString("hex")}`;
}

/**
 * Applies the effect of a successful payment exactly once. Both the
 * webhook and the polling fallback call this — whichever learns of
 * success first "wins"; the guard below makes the second call a no-op.
 */
export async function applySuccessfulPayment(
  payment: HydratedDocument<IPayment>,
  originHint: string
): Promise<void> {
  if (payment.status === "successful") {
    return;
  }

  payment.status = "successful";
  await payment.save();

  const school = await School.findById(payment.school);
  if (!school) return;

  const wasAwaitingPayment = school.status === "awaiting_payment";
  const now = new Date();
  const base =
    school.subscriptionExpiresAt && school.subscriptionExpiresAt > now
      ? school.subscriptionExpiresAt
      : now;

  school.subscriptionExpiresAt = new Date(base.getTime() + ONE_YEAR_MS);

  if (wasAwaitingPayment) {
    school.status = "pending";
  }

  await school.save();

  if (wasAwaitingPayment) {
    try {
      const admins = await User.find({ role: "admin" }).select("email");
      await sendNewSchoolNotificationToAdmins(
        admins.map((a) => a.email),
        school.name,
        `${originHint}/admin/schools/${school._id}`
      );
    } catch (err) {
      console.error("Failed to notify admins after payment success:", err);
    }
  }
}

export async function markPaymentFailed(
  payment: HydratedDocument<IPayment>,
  reason?: string
): Promise<void> {
  if (payment.status !== "pending") return;
  payment.status = "failed";
  payment.failureReason = reason;
  await payment.save();
}
