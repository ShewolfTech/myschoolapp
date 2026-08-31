"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const TABS = ["pending", "approved", "rejected", "all"] as const;
type Tab = (typeof TABS)[number];

interface AdminSchool {
  _id: string;
  name: string;
  region: string;
  district: { name: string } | null;
  ownershipType: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: { name: string; email: string } | null;
  contact: { phone: string; email?: string };
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-chalkboard text-paper-white",
  pending: "bg-stamp-gold text-ink",
  rejected: "bg-margin-red text-paper-white",
};

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("pending");
  const [schools, setSchools] = useState<AdminSchool[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback((currentTab: Tab) => {
    setLoading(true);
    const query = currentTab === "all" ? "" : `?status=${currentTab}`;
    fetch(`/api/admin/schools${query}`)
      .then((res) => res.json())
      .then((data) => setSchools(data.schools ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(tab);
  }, [tab, load]);

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-display text-sm font-semibold px-4 py-2 rounded-t-sm border-t border-x capitalize transition-colors ${
              tab === t
                ? "bg-chalkboard text-paper-white border-chalkboard"
                : "bg-paper-dark text-ink-soft border-transparent hover:text-chalkboard"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-soft font-ledger text-sm">Loading&hellip;</p>
      ) : schools.length === 0 ? (
        <p className="text-ink-soft">No schools in this category.</p>
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => (
            <li
              key={school._id}
              className="bg-paper-white border border-ink-soft/30 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-display text-lg font-semibold text-chalkboard">
                  {school.name}
                </p>
                <p className="text-sm text-ink-soft">
                  {school.district?.name ?? "—"}, {school.region} Region &middot;{" "}
                  {school.ownershipType}
                </p>
                <p className="text-xs text-ink-soft/70 mt-1">
                  Submitted by {school.submittedBy?.name ?? "unknown"} (
                  {school.submittedBy?.email ?? "—"})
                </p>
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
                  href={`/admin/schools/${school._id}`}
                  className="bg-chalkboard text-paper-white font-ledger text-xs rounded-sm px-4 py-2 hover:bg-chalkboard-dark transition-colors"
                >
                  Review
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
