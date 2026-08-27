"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
        <p className="text-margin-red mb-4">
          This reset link is missing its token. Please use the link from your email.
        </p>
        <Link href="/forgot-password" className="text-chalkboard font-semibold hover:text-margin-red">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
        <p className="text-chalkboard font-semibold mb-2">Password reset!</p>
        <p className="text-sm text-ink-soft">Taking you to log in&hellip;</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8">
      <h1 className="font-display text-2xl font-semibold text-chalkboard mb-6">
        Choose a new password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
        </div>

        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
        </div>

        {error && <p className="text-sm text-margin-red">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-ink-soft">Loading&hellip;</p>}>
        <ResetPasswordInner />
      </Suspense>
    </main>
  );
}
