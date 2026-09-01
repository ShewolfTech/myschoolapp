"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function CompleteProfileForm () {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState<"parent" | "school_rep" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(role: "parent" | "school_rep") {
    setError(null);
    setLoading(role);

    const res = await fetch("/api/auth/complete-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(null);
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    // Refresh the JWT so it carries the new role without a full re-login
    await update({ role });

    router.push(role === "school_rep" ? "/register-school" : "/");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-chalkboard mb-2">
          One more thing
        </h1>
        <p className="text-sm text-ink-soft mb-6">
          Are you a parent looking for a school, or do you represent one?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => choose("parent")}
            disabled={loading !== null}
            className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
          >
            {loading === "parent" ? "Setting up..." : "I'm a parent"}
          </button>
          <button
            onClick={() => choose("school_rep")}
            disabled={loading !== null}
            className="w-full border border-chalkboard text-chalkboard font-ledger text-sm rounded-sm py-3 hover:bg-paper-dark transition-colors disabled:opacity-60"
          >
            {loading === "school_rep" ? "Setting up..." : "I represent a school"}
          </button>
        </div>

        {error && <p className="text-sm text-margin-red mt-4">{error}</p>}
      </div>
    </main>
  );
}
