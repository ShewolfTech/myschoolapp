"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8">
        <h1 className="font-display text-2xl font-semibold text-chalkboard mb-2">
          Forgot your password?
        </h1>
        <p className="text-sm text-ink-soft mb-6">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>

        {message ? (
          <p className="text-sm text-chalkboard bg-paper-dark rounded-sm px-4 py-3">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-soft mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
              />
            </div>

            {error && <p className="text-sm text-margin-red">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-ink-soft mt-6 text-center">
          <Link href="/login" className="text-chalkboard font-semibold hover:text-margin-red">
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  );
}
