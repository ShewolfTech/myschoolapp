"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Verification failed.");
          return;
        }
        setStatus("success");
        setMessage(data.message ?? "Email verified successfully.");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8 text-center">
      {status === "loading" && <p className="text-ink-soft">Verifying your email&hellip;</p>}

      {status === "success" && (
        <>
          <p className="font-display text-xl text-chalkboard mb-2">Email verified!</p>
          <p className="text-sm text-ink-soft mb-4">{message}</p>
          <Link
            href="/"
            className="inline-block bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:bg-chalkboard-dark transition-colors"
          >
            Continue
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="font-display text-xl text-margin-red mb-2">Verification failed</p>
          <p className="text-sm text-ink-soft">{message}</p>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-ink-soft">Loading&hellip;</p>}>
        <VerifyEmailInner />
      </Suspense>
    </main>
  );
}
