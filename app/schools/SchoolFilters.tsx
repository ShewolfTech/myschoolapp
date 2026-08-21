"use client";

import { useEffect, useState } from "react";

const REGIONS = ["All", "Central", "Eastern", "Northern", "Western"] as const;
const OWNERSHIP_TYPES = ["All", "Government", "Private", "Government-Aided"] as const;
const LEVELS = ["All", "Nursery", "Primary", "Secondary"] as const;
const BOARDING_TYPES = ["All", "Day", "Boarding", "Both"] as const;
const CURRICULUM_TYPES = ["All", "Uganda National Curriculum", "British", "American", "Other"] as const;

export interface Filters {
  search: string;
  region: string;
  district: string;
  ownershipType: string;
  level: string;
  boardingType: string;
  curriculum: string;
}

interface District {
  id: string;
  name: string;
  region: string;
}

export function SchoolFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Fetch districts whenever region changes (cascading filter)
  useEffect(() => {
    const url =
      filters.region && filters.region !== "All"
        ? `/api/districts?region=${encodeURIComponent(filters.region)}`
        : "/api/districts";

    fetch(url)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => setDistricts([]));
  }, [filters.region]);

  // Debounce free-text search so we're not firing a request on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput });
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="border-b border-dashed border-ink-soft/40 pb-6 mb-6">
      {/* Region tabs, styled like ledger section dividers */}
      <div className="flex flex-wrap gap-1 mb-5">
        {REGIONS.map((region) => {
          const active = filters.region === region || (region === "All" && !filters.region);
          return (
            <button
              key={region}
              onClick={() =>
                onChange({ ...filters, region: region === "All" ? "" : region, district: "" })
              }
              className={`font-display text-sm font-semibold px-4 py-2 rounded-t-sm border-t border-x transition-colors ${
                active
                  ? "bg-chalkboard text-paper-white border-chalkboard"
                  : "bg-paper-dark text-ink-soft border-transparent hover:text-chalkboard"
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search by school name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="col-span-1 sm:col-span-2 lg:col-span-2 bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-chalkboard"
        />

        <select
          value={filters.district}
          onChange={(e) => onChange({ ...filters, district: e.target.value })}
          className="bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={filters.ownershipType}
          onChange={(e) => onChange({ ...filters, ownershipType: e.target.value })}
          className="bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          {OWNERSHIP_TYPES.map((o) => (
            <option key={o} value={o === "All" ? "" : o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.level}
          onChange={(e) => onChange({ ...filters, level: e.target.value })}
          className="bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l === "All" ? "" : l}>
              {l === "All" ? "All levels" : l}
            </option>
          ))}
        </select>
      </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <select
          value={filters.boardingType}
          onChange={(e) => onChange({ ...filters, boardingType: e.target.value })}
          className="bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          {BOARDING_TYPES.map((b) => (
            <option key={b} value={b === "All" ? "" : b}>
              {b === "All" ? "Day or boarding — any" : b}
            </option>
          ))}
        </select>

        <select
          value={filters.curriculum}
          onChange={(e) => onChange({ ...filters, curriculum: e.target.value })}
          className="bg-paper-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          {CURRICULUM_TYPES.map((c) => (
            <option key={c} value={c === "All" ? "" : c}>
              {c === "All" ? "Any curriculum" : c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
