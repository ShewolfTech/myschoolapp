import Link from "next/link";
import { requireRole } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/School";
import "@/models/District";

interface ManagedSchool {
  _id: { toString(): string };
  name: string;
  slug: string;
  region: string;
  district: { name: string } | null;
  status: "awaiting_payment" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  subscriptionExpiresAt?: string | Date;
}

const STATUS_STYLES: Record<string, string> = {
  awaiting_payment: "bg-margin-red text-paper-white",
  approved: "bg-ink text-paper-white",
  pending: "bg-stamp-gold text-ink",
  rejected: "bg-margin-red text-paper-white",
};

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "payment required",
  approved: "approved",
  pending: "pending",
  rejected: "rejected",
};

function subscriptionInfo(expiresAt?: string | Date) {
  if (!expiresAt) return null;
  const expiry = new Date(expiresAt);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return { expiry, daysLeft, expired: daysLeft <= 0, expiringSoon: daysLeft > 0 && daysLeft <= 30 };
}

export default async function RegisterSchoolDashboard() {
  const session = await requireRole(["school_rep"]);

  await connectDB();
  const user = await User.findById(session.user.id)
    .populate({
      path: "managedSchools",
      populate: { path: "district", select: "name" },
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  const schools = (user?.managedSchools ?? []) as unknown as ManagedSchool[];

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-on-navy">My schools</h1>
        <Link
          href="/register-school/new"
          className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:brightness-110 transition-all"
        >
          + Register a school
        </Link>
      </div>

      {schools.length === 0 ? (
        <div className="bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
          <p className="font-display text-xl text-chalkboard mb-2">You haven&apos;t registered a school yet.</p>
          <p className="text-ink-soft mb-6">Add your school&apos;s details so parents can find it.</p>
          <Link
            href="/register-school/new"
            className="inline-block bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:brightness-110 transition-all"
          >
            + Register a school
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => {
            const sub = subscriptionInfo(school.subscriptionExpiresAt);
            const needsRenewal = sub?.expired && school.status !== "awaiting_payment";

            return (
              <li
                key={school._id.toString()}
                className="bg-paper-white border border-ink-soft/30 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-chalkboard">{school.name}</p>
                  <p className="text-sm text-ink-soft">
                    {school.district?.name ?? "—"}, {school.region} Region
                  </p>
                  {school.status === "rejected" && school.rejectionReason && (
                    <p className="text-sm text-margin-red mt-1">{school.rejectionReason}</p>
                  )}
                  {sub && school.status !== "awaiting_payment" && (
                    <p className={`text-xs mt-1 ${sub.expired || sub.expiringSoon ? "text-margin-red" : "text-ink-soft/70"}`}>
                      {sub.expired
                        ? `Listing expired ${sub.expiry.toLocaleDateString()} — renew to stay visible to parents.`
                        : `Listing active until ${sub.expiry.toLocaleDateString()}${sub.expiringSoon ? " (renewing soon)" : ""}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-ledger text-xs uppercase px-3 py-1 rounded-sm ${STATUS_STYLES[school.status] ?? "bg-paper-dark text-ink"}`}>
                    {STATUS_LABELS[school.status] ?? school.status}
                  </span>
                  {school.status === "awaiting_payment" ? (
                    <Link
                      href={`/register-school/${school._id.toString()}/pay`}
                      className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-4 py-2 hover:brightness-110 transition-all"
                    >
                      Pay now
                    </Link>
                  ) : needsRenewal ? (
                    <Link
                      href={`/register-school/${school._id.toString()}/pay`}
                      className="bg-margin-red text-paper-white font-ledger text-sm rounded-sm px-4 py-2 hover:brightness-110 transition-all"
                    >
                      Renew
                    </Link>
                  ) : (
                    <Link
                      href={`/register-school/${school._id.toString()}/edit`}
                      className="text-chalkboard font-ledger text-sm hover:text-margin-red"
                    >
                      Edit
                    </Link>
                  )}
                  {school.status === "approved" && (
                    <Link
                      href={`/schools/${school.slug}`}
                      className="text-chalkboard font-ledger text-sm hover:text-margin-red"
                    >
                      View
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
