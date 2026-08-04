"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "school_rep">("parent");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8">
        <h1 className="font-display text-2xl font-semibold text-chalkboard mb-6">
          Create an account
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`flex-1 text-sm font-ledger rounded-sm py-2 border transition-colors ${
              role === "parent"
                ? "bg-chalkboard text-paper-white border-chalkboard"
                : "bg-transparent text-ink-soft border-ink-soft/40"
            }`}
          >
            I&apos;m a parent
          </button>
          <button
            type="button"
            onClick={() => setRole("school_rep")}
            className={`flex-1 text-sm font-ledger rounded-sm py-2 border transition-colors ${
              role === "school_rep"
                ? "bg-chalkboard text-paper-white border-chalkboard"
                : "bg-transparent text-ink-soft border-ink-soft/40"
            }`}
          >
            I&apos;m a school rep
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-soft mb-1" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
            />
          </div>

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

          <div>
            <label className="block text-sm text-ink-soft mb-1" htmlFor="password">
              Password
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
            <p className="text-xs text-ink-soft/70 mt-1">At least 8 characters.</p>
          </div>

          {error && <p className="text-sm text-margin-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-chalkboard font-semibold hover:text-margin-red">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
