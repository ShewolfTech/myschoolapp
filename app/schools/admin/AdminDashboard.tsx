"use client";

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

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("pending");
  const [schools, setSchools] = useState<AdminSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

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

  async function approve(id: string) {
    setActionError(null);
    const res = await fetch(`/api/admin/schools/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError(data.error ?? "Failed to approve");
      return;
    }
    load(tab);
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) {
      setActionError("Please provide a reason for rejecting.");
      return;
    }
    setActionError(null);
    const res = await fetch(`/api/admin/schools/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectionReason: rejectReason.trim() }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError(data.error ?? "Failed to reject");
      return;
    }
    setRejectingId(null);
    setRejectReason("");
    load(tab);
  }

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

      {actionError && (
        <p className="text-sm text-margin-red mb-4">{actionError}</p>
      )}

      {loading ? (
        <p className="text-ink-soft font-ledger text-sm">Loading&hellip;</p>
      ) : schools.length === 0 ? (
        <p className="text-ink-soft">No schools in this category.</p>
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => (
            <li
              key={school._id}
              className="bg-paper-white border border-ink-soft/30 rounded-sm p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
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
                    {school.submittedBy?.email ?? "—"}) &middot; Contact:{" "}
                    {school.contact.phone}
                  </p>
                </div>

                {school.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => approve(school._id)}
                      className="bg-chalkboard text-paper-white font-ledger text-xs rounded-sm px-4 py-2 hover:bg-chalkboard-dark transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(school._id);
                        setRejectReason("");
                        setActionError(null);
                      }}
                      className="border border-margin-red text-margin-red font-ledger text-xs rounded-sm px-4 py-2 hover:bg-margin-red/10 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {school.status !== "pending" && (
                  <span
                    className={`font-ledger text-xs uppercase px-3 py-1 rounded-sm self-start ${
                      school.status === "approved"
                        ? "bg-chalkboard text-paper-white"
                        : "bg-margin-red text-paper-white"
                    }`}
                  >
                    {school.status}
                  </span>
                )}
              </div>

              {rejectingId === school._id && (
                <div className="mt-4 border-t border-dashed border-ink-soft/40 pt-4">
                  <label className="block text-sm text-ink-soft mb-1">
                    Reason for rejection (shown to the school rep)
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-margin-red mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => reject(school._id)}
                      className="bg-margin-red text-paper-white font-ledger text-xs rounded-sm px-4 py-2"
                    >
                      Confirm rejection
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="text-ink-soft font-ledger text-xs px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
