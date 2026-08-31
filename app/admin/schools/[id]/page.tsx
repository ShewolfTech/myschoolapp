import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import "@/models/District";
import "@/models/User";
import { formatUGX, groupFeesByTerm } from "@/lib/feeDisplay";
import { AdminReviewActions } from "./AdminReviewActions";

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-chalkboard text-paper-white",
  pending: "bg-stamp-gold text-ink",
  rejected: "bg-margin-red text-paper-white",
};

export default async function AdminSchoolReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  await connectDB();
  const school = await School.findById(id)
    .populate("district", "name")
    .populate("submittedBy", "name email")
    .lean();

  if (!school) {
    notFound();
  }

  const districtName = (school.district as unknown as { name: string })?.name ?? "";
  const submitter = school.submittedBy as unknown as { name: string; email: string } | null;
  const feeGroups = groupFeesByTerm(school.feeStructure);

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm text-chalkboard hover:text-margin-red font-ledger">
        ← Back to all submissions
      </Link>

      <div className="bg-paper-white border border-ink-soft/30 rounded-sm p-8 mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <span className="font-ledger text-xs uppercase tracking-widest text-ruled-blue">
            {districtName}, {school.region} Region
          </span>
          <span
            className={`font-ledger text-xs uppercase px-3 py-1 rounded-sm ${
              STATUS_STYLES[school.status] ?? "bg-paper-dark text-ink"
            }`}
          >
            {school.status}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-chalkboard mb-4">
          {school.name}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="font-ledger text-xs bg-chalkboard text-paper-white px-3 py-1 rounded-sm">
            {school.ownershipType}
          </span>
          {school.levels.map((level: string) => (
            <span key={level} className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
              {level}
            </span>
          ))}
          <span className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
            {school.boardingType}
          </span>
          <span className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
            {school.curriculum}
          </span>
          {school.foundedYear && (
            <span className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
              Founded {school.foundedYear}
            </span>
          )}
        </div>

        {school.subCounty || school.address ? (
          <p className="text-sm text-ink-soft mb-4">
            {[school.subCounty, school.address].filter(Boolean).join(", ")}
          </p>
        ) : null}

        {school.description && (
          <p className="text-ink-soft mb-6 leading-relaxed">{school.description}</p>
        )}

        {(school.images?.length > 0 || school.video) && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-semibold text-chalkboard mb-2">
              Photos &amp; video
            </h2>
            {school.images?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {school.images.map((src: string) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={school.name}
                    className="w-full aspect-square object-cover rounded-sm border border-ink-soft/30"
                  />
                ))}
              </div>
            )}
            {school.video && (
              <video
                src={school.video}
                controls
                className="w-full rounded-sm border border-ink-soft/30"
              />
            )}
          </section>
        )}

        {school.facilities?.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-semibold text-chalkboard mb-2">
              Facilities
            </h2>
            <ul className="flex flex-wrap gap-2">
              {school.facilities.map((facility: string) => (
                <li
                  key={facility}
                  className="text-sm text-ink-soft border border-ink-soft/30 rounded-sm px-3 py-1"
                >
                  {facility}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Object.keys(feeGroups).length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">
              Fee structure
            </h2>
            <div className="space-y-4">
              {Object.entries(feeGroups).map(([label, items]) => (
                <div key={label}>
                  <p className="font-ledger text-xs uppercase tracking-wide text-ruled-blue mb-1">
                    {label}
                  </p>
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} className="ruled-row">
                          <td className="py-2 text-ink-soft">
                            {item.category}
                            {item.notes ? ` (${item.notes})` : ""}
                          </td>
                          <td className="py-2 text-right font-ledger text-ink font-semibold">
                            {formatUGX(item.amountUGX)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold text-chalkboard mb-2">
            Contact given
          </h2>
          <p className="text-sm text-ink-soft">
            {school.contact.phone}
            {school.contact.email ? ` · ${school.contact.email}` : ""}
            {school.contact.website ? ` · ${school.contact.website}` : ""}
          </p>
        </section>

        <section className="mb-8 border-t border-dashed border-ink-soft/40 pt-6">
          <h2 className="font-display text-lg font-semibold text-chalkboard mb-2">
            Submitted by
          </h2>
          <p className="text-sm text-ink-soft">
            {submitter?.name ?? "Unknown"} ({submitter?.email ?? "—"})
          </p>
          {school.status === "rejected" && school.rejectionReason && (
            <p className="text-sm text-margin-red mt-2">
              Previous rejection reason: {school.rejectionReason}
            </p>
          )}
        </section>

        <AdminReviewActions schoolId={school._id.toString()} status={school.status} />
      </div>
    </main>
  );
}
