import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { School, IFeeItem } from "@/models/School";
import { Review } from "@/models/Review";
import "@/models/District";
import "@/models/User";
import { requireAuth } from "@/lib/authHelpers";
import { User } from "@/models/User";
import { FavoriteButton } from "./FavoriteButton";
import { formatUGX, groupFeesByTerm } from "@/lib/feeDisplay";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";
import { Avatar } from "@/app/Avatar";

async function getSchool(slug: string) {
  await connectDB();
  const school = await School.findOne({
    slug,
    status: "approved",
    $or: [{ subscriptionExpiresAt: { $exists: false } }, { subscriptionExpiresAt: { $gt: new Date() } }],
  })
    .populate("district", "name")
    .lean();
  return school;
}

async function getReviews(schoolId: string) {
  const reviews = await Review.find({ school: schoolId })
    .populate("user", "name image")
    .sort({ createdAt: -1 })
    .lean();
  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  return { reviews, average, count: reviews.length };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireAuth();
  const { slug } = await params;
  const school = await getSchool(slug);

  if (!school) {
    notFound();
  }

  const user = await User.findById(session.user.id).select("favorites role").lean();
  const isFavorited =
    user?.favorites?.some(
      (favId: { toString(): string }) => favId.toString() === school._id.toString()
    ) ?? false;

  const { reviews, average, count } = await getReviews(school._id.toString());

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1 mb-2">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-chalkboard">
            {school.name}
          </h1>
          <FavoriteButton
            schoolId={school._id.toString()}
            initialFavorited={isFavorited}
            isLoggedIn={true}
          />
        </div>

        {count > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={average} />
            <span className="text-sm text-ink-soft">
              {average.toFixed(1)} &middot; {count} review{count === 1 ? "" : "s"}
            </span>
          </div>
        )}

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
          {school.moeRegistrationNumber && (
            <span className="font-ledger text-xs bg-ruled-blue text-paper-white px-3 py-1 rounded-sm">
              MoE Reg. No: {school.moeRegistrationNumber}
            </span>
          )}
        </div>

        {school.description && (
          <p className="text-ink-soft mb-6 leading-relaxed">{school.description}</p>
        )}

        {(school.images?.length > 0 || school.video) && (
          <section className="mb-8">
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
              <video src={school.video} controls className="w-full rounded-sm border border-ink-soft/30" />
            )}
          </section>
        )}

        {school.facilities?.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-semibold text-chalkboard mb-2">Facilities</h2>
            <ul className="flex flex-wrap gap-2">
              {school.facilities.map((facility: string) => (
                <li key={facility} className="text-sm text-ink-soft border border-ink-soft/30 rounded-sm px-3 py-1">
                  {facility}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Object.keys(feeGroups).length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">Fee structure</h2>
            <div className="space-y-4">
              {Object.entries(feeGroups).map(([label, items]) => (
                <div key={label}>
                  <p className="font-ledger text-xs uppercase tracking-wide text-ruled-blue mb-1">{label}</p>
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((item: IFeeItem, i: number) => (
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
              Fees are as reported by the school and may change by term — confirm directly before paying.
            </p>
          </section>
        )}

        <section className="border-t border-dashed border-ink-soft/40 pt-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">Contact this school</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${school.contact.phone}`}
              className="inline-flex items-center justify-center rounded-sm bg-chalkboard text-paper-white px-5 py-3 font-ledger text-sm hover:brightness-110 transition-all"
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
        </section>

        <section className="border-t border-dashed border-ink-soft/40 pt-6">
          <h2 className="font-display text-lg font-semibold text-chalkboard mb-4">
            Reviews {count > 0 && `(${count})`}
          </h2>

          {user?.role === "parent" && (
            <div className="mb-6">
              <ReviewForm schoolId={school._id.toString()} />
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-ink-soft">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => {
                const reviewer = review.user as unknown as { name: string; image?: string } | null;
                return (
                  <li key={review._id.toString()} className="border-b border-dashed border-ink-soft/30 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={reviewer?.name ?? "Parent"} image={reviewer?.image} size={28} />
                      <span className="text-sm font-semibold text-chalkboard">
                        {reviewer?.name ?? "Parent"}
                      </span>
                      <StarRating rating={review.rating} size="text-sm" />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-ink-soft ml-9">{review.comment}</p>
                    )}
                    <p className="text-xs text-ink-soft/60 ml-9 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
