import Link from "next/link";
import { requireRole } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/District";

interface ManagedSchool {
  _id: { toString(): string };
  name: string;
  slug: string;
  region: string;
  district: { name: string } | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-chalkboard text-paper-white",
  pending: "bg-stamp-gold text-ink",
  rejected: "bg-margin-red text-paper-white",
};

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
        <h1 className="font-display text-3xl font-semibold text-chalkboard">
          My schools
        </h1>
        <Link
          href="/register-school/new"
          className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:bg-chalkboard-dark transition-colors"
        >
          + Register a school
        </Link>
      </div>

      {schools.length === 0 ? (
        <div className="bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
          <p className="font-display text-xl text-chalkboard mb-2">
            You haven&apos;t registered a school yet.
          </p>
          <p className="text-ink-soft mb-6">
            Add your school&apos;s details so parents can find it.
          </p>
          <Link
            href="/register-school/new"
            className="inline-block bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:bg-chalkboard-dark transition-colors"
          >
            + Register a school
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => (
            <li
              key={school._id.toString()}
              className="bg-paper-white border border-ink-soft/30 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-display text-lg font-semibold text-chalkboard">
                  {school.name}
                </p>
                <p className="text-sm text-ink-soft">
                  {school.district?.name ?? "—"}, {school.region} Region
                </p>
                {school.status === "rejected" && school.rejectionReason && (
                  <p className="text-sm text-margin-red mt-1">
                    {school.rejectionReason}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`font-ledger text-xs uppercase px-3 py-1 rounded-sm ${
                    STATUS_STYLES[school.status] ?? "bg-paper-dark text-ink"
                  }`}
                >
                  {school.status}
                </span>
                <Link
                  href={`/register-school/${school._id.toString()}/edit`}
                  className="text-chalkboard font-ledger text-sm hover:text-margin-red"
                >
                  Edit
                </Link>
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
          ))}
        </ul>
      )}
    </main>
  );
}
