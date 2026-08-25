import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { School, IFeeItem } from "@/models/School";
import "@/models/District";
import { requireAuth } from "@/lib/authHelpers";
import { User } from "@/models/User";
import { FavoriteButton } from "./FavoriteButton";

async function getSchool(slug: string) {
  await connectDB();
  const school = await School.findOne({ slug, status: "approved" })
    .populate("district", "name")
    .lean();
  return school;
}

function formatUGX(amount: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

function groupFeesByTerm(feeStructure: IFeeItem[]) {
  const groups: Record<string, IFeeItem[]> = {};
  for (const item of feeStructure) {
    const key = `${item.level} — ${item.term}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchool(slug);

  if (!school) {
    notFound();
  }

  const session = await requireAuth();
  // let isFavorited = false;
  // if (session?.user) {
  //   const user = await User.findById(session.user.id).select("favorites").lean();
  //   isFavorited =
  //     user?.favorites?.some(
  //       (favId: { toString(): string }) => favId.toString() === school._id.toString()
  //     ) ?? false;
  // }

  const user = await User.findById(session.user.id).select("favorites").lean();
  const isFavorited =
    user?.favorites?.some(
      (favId: { toString(): string }) => favId.toString() === school._id.toString()
    ) ?? false;

  const districtName = (school.district as unknown as { name: string })?.name ?? "";
  const feeGroups = groupFeesByTerm(school.feeStructure);

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
      <div className="relative bg-paper-white border border-ink-soft/30 rounded-sm p-8">
        <div className="stamp absolute top-6 right-6 border-2 border-margin-red text-margin-red font-semibold text-sm uppercase tracking-wider px-3 py-1 rounded-sm opacity-80">
          Verified listing
        </div>

        <span className="font-ledger text-xs uppercase tracking-widest text-ruled-blue">
          {districtName}, {school.region} Region
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1 mb-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-chalkboard">
            {school.name}
          </h1>
          <FavoriteButton
            schoolId={school._id.toString()}
            initialFavorited={isFavorited}
            isLoggedIn={true}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="font-ledger text-xs bg-chalkboard text-paper-white px-3 py-1 rounded-sm">
            {school.ownershipType}
          </span>
          {school.levels.map((level: string) => (
            <span
              key={level}
              className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm"
            >
              {level}
            </span>
          ))}
          <span className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
            {school.boardingType}
          </span>
          <span className="font-ledger text-xs bg-paper-dark text-ink px-3 py-1 rounded-sm">
            {school.curriculum}
          </span>
        </div>

        {school.description && (
          <p className="text-ink-soft mb-6 leading-relaxed">{school.description}</p>
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
            <p className="text-xs text-ink-soft/70 mt-3">
              Fees are as reported by the school and may change by term — confirm
              directly before paying.
            </p>
          </section>
        )}

        <section className="border-t border-dashed border-ink-soft/40 pt-6">
          <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">
            Contact this school
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${school.contact.phone}`}
              className="inline-flex items-center justify-center rounded-sm bg-chalkboard text-paper-white px-5 py-3 font-ledger text-sm hover:bg-chalkboard-dark transition-colors"
            >
              Call {school.contact.phone}
            </a>
            {school.contact.email && (
              <a
                href={`mailto:${school.contact.email}`}
                className="inline-flex items-center justify-center rounded-sm border border-chalkboard text-chalkboard px-5 py-3 font-ledger text-sm hover:bg-paper-dark transition-colors"
              >
                Email {school.contact.email}
              </a>
            )}
          </div>
          <p className="text-xs text-ink-soft/70 mt-3">
            An in-app inquiry form (no need to dial or type an email yourself)
            is coming in a later step.
          </p>
        </section>
      </div>
    </main>
  );
}
