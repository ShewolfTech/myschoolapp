"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminReviewActions({
  schoolId,
  status,
}: {
  schoolId: string;
  status: "pending" | "approved" | "rejected";
}) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function approve() {
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/admin/schools/${schoolId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to approve");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function reject() {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejecting.");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/admin/schools/${schoolId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectionReason: rejectReason.trim() }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to reject");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  if (status !== "pending") {
    // Already decided — still allow changing your mind (e.g. re-approve after
    // a mistaken rejection), but present it as a secondary action, not the
    // primary flow.
    return (
      <div className="border-t border-dashed border-ink-soft/40 pt-6">
        <p className="text-sm text-ink-soft mb-3">
          This school is currently <strong>{status}</strong>. You can change
          that decision below if needed.
        </p>
        {status === "rejected" ? (
          <button
            onClick={approve}
            disabled={loading}
            className="bg-ink text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:brightness-125 transition-all disabled:opacity-60"
          >
            {loading ? "Approving..." : "Approve instead"}
          </button>
        ) : (
          <button
            onClick={() => setRejecting(true)}
            disabled={loading}
            className="border border-margin-red text-margin-red font-ledger text-sm rounded-sm px-5 py-3 hover:bg-margin-red/10 transition-colors"
          >
            Reject instead
          </button>
        )}
        {rejecting && (
          <div className="mt-4">
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection"
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-margin-red mb-2"
            />
            <button
              onClick={reject}
              disabled={loading}
              className="bg-margin-red text-paper-white font-ledger text-xs rounded-sm px-4 py-2"
            >
              Confirm rejection
            </button>
          </div>
        )}
        {error && <p className="text-sm text-margin-red mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="border-t border-dashed border-ink-soft/40 pt-6">
      <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">
        Review decision
      </h2>
      <div className="flex gap-3">
        <button
          onClick={approve}
          disabled={loading}
          className="bg-ink text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:brightness-125 transition-all disabled:opacity-60"
        >
          {loading ? "Approving..." : "Approve"}
        </button>
        <button
          onClick={() => setRejecting(true)}
          disabled={loading}
          className="border border-margin-red text-margin-red font-ledger text-sm rounded-sm px-5 py-3 hover:bg-margin-red/10 transition-colors"
        >
          Reject
        </button>
      </div>

      {rejecting && (
        <div className="mt-4">
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
              onClick={reject}
              disabled={loading}
              className="bg-margin-red text-paper-white font-ledger text-xs rounded-sm px-4 py-2"
            >
              Confirm rejection
            </button>
            <button
              onClick={() => setRejecting(false)}
              className="text-ink-soft font-ledger text-xs px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-margin-red mt-2">{error}</p>}
    </div>
  );
}
