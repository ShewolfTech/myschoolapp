"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SchoolFilters, Filters } from "./SchoolFilters";
import { SchoolResults, SchoolListItem } from "./SchoolResults";

const EMPTY_FILTERS: Filters = {
  search: "",
  region: "",
  district: "",
  ownershipType: "",
  level: "",
  boardingType: "",
  curriculum: "",
};

function SchoolsBrowserInner() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    region: searchParams.get("region") ?? "",
  });
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = useCallback((f: Filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.region) params.set("region", f.region);
    if (f.district) params.set("district", f.district);
    if (f.ownershipType) params.set("ownershipType", f.ownershipType);
    if (f.level) params.set("level", f.level);
    if (f.boardingType) params.set("boardingType", f.boardingType);
    if (f.curriculum) params.set("curriculum", f.curriculum);

    fetch(`/api/schools?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setSchools(data.schools ?? []))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSchools(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-chalkboard mb-1">
        Find a school
      </h1>
      <p className="text-ink-soft mb-8">
        {schools.length} approved school{schools.length === 1 ? "" : "s"} listed so far
      </p>

      <SchoolFilters filters={filters} onChange={setFilters} />
      <SchoolResults schools={schools} loading={loading} />
    </main>
  );
}

export function SchoolsBrowser() {
  return (
    <Suspense fallback={<div className="flex-1 px-6 py-10">Loading&hellip;</div>}>
      <SchoolsBrowserInner />
    </Suspense>
  );
}
