import Link from "next/link";

export interface SchoolListItem {
  id: string;
  name: string;
  slug: string;
  region: string;
  district: string;
  ownershipType: string;
  levels: string[];
  boardingType: string;
  curriculum: string;
}

const OWNERSHIP_COLORS: Record<string, string> = {
  Government: "bg-ink",
  Private: "bg-margin-red",
  "Government-Aided": "bg-stamp-gold",
};

export function SchoolResults({
  schools,
  loading,
}: {
  schools: SchoolListItem[];
  loading: boolean;
}) {
  if (loading) {
    return <p className="text-ink-soft font-ledger text-sm">Loading schools&hellip;</p>;
  }

  if (schools.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-xl text-chalkboard mb-2">No schools match yet.</p>
        <p className="text-ink-soft text-sm">
          Try widening your search &mdash; clear a filter or pick &ldquo;All
          regions&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <ul>
      {schools.map((school) => (
        <li key={school.id} className="ruled-row">
          <Link
            href={`/schools/${school.slug}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 group"
          >
            <div>
              <p className="font-display text-lg font-semibold text-chalkboard group-hover:text-margin-red transition-colors">
                {school.name}
              </p>
              <p className="text-sm text-ink-soft">
                {school.district}, {school.region} Region &middot;{" "}
                {school.levels.join(", ")} &middot; {school.boardingType}
              </p>
            </div>
            <span
              className={`shrink-0 font-ledger text-xs text-paper-white px-3 py-1 rounded-sm self-start sm:self-center ${
                OWNERSHIP_COLORS[school.ownershipType] ?? "bg-ink-soft"
              }`}
            >
              {school.ownershipType}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
