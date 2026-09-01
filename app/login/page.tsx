"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "../PasswordInput";
import { GoogleSignInButton } from "../GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("That email or password doesn't match our records.");
      return;
    }

    const session = await getSession();
    setLoading(false);

    router.push(session?.user?.role === "school_rep" ? "/register-school" : "/");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8">
        <h1 className="font-display text-2xl font-semibold text-chalkboard mb-6">
          Log in
        </h1>

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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-ink-soft" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-chalkboard hover:text-margin-red">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-margin-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-ink-soft/30" />
          <span className="text-xs text-ink-soft/70 font-ledger">OR</span>
          <div className="flex-1 border-t border-ink-soft/30" />
        </div>

        <GoogleSignInButton />

        <p className="text-sm text-ink-soft mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-chalkboard font-semibold hover:text-margin-red">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
