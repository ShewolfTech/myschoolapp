import { notFound } from "next/navigation";
import { requireRole } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import { getListingFeeUGX } from "@/lib/payments";
import { PaymentFlow } from "./PaymentFlow";

export default async function PaySchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["school_rep"]);
  const { id } = await params;

  await connectDB();

  const school = await School.findOne({ _id: id, submittedBy: session.user.id }).lean();
  if (!school) {
    notFound();
  }

  const feeUGX = getListingFeeUGX();
  const isRenewal = school.status !== "awaiting_payment";

  return (
    <main className="flex-1 max-w-md w-full mx-auto px-6 py-10">
      <PaymentFlow
        schoolId={school._id.toString()}
        schoolName={school.name}
        feeUGX={feeUGX}
        isRenewal={isRenewal}
        currentExpiry={school.subscriptionExpiresAt?.toISOString()}
      />
    </main>
  );
}
