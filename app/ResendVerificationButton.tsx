"use client";

import { useState } from "react";

export function ResendVerificationButton() {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  async function resend() {
    setState("loading");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    setState(res.ok ? "sent" : "idle");
  }

  if (state === "sent") {
    return <span className="font-ledger text-xs">Check your inbox!</span>;
  }

  return (
    <button
      onClick={resend}
      disabled={state === "loading"}
      className="font-ledger text-xs underline hover:no-underline disabled:opacity-60"
    >
      {state === "loading" ? "Sending..." : "Resend email"}
    </button>
  );
}
