"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function formatUGX(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

type Stage = "form" | "waiting" | "success" | "failed";

export function PaymentFlow({
  schoolId,
  schoolName,
  feeUGX,
  isRenewal,
  currentExpiry,
}: {
  schoolId: string;
  schoolName: string;
  feeUGX: number;
  isRenewal: boolean;
  currentExpiry?: string;
}) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function startPolling(ref: string) {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      const res = await fetch(`/api/payments/status?reference=${encodeURIComponent(ref)}`);
      const data = await res.json();

      if (data.status === "successful") {
        if (pollRef.current) clearInterval(pollRef.current);
        setStage("success");
        setTimeout(() => {
          router.push("/register-school");
          router.refresh();
        }, 2000);
      } else if (data.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        setStage("failed");
        setError("The payment wasn't approved. You can try again below.");
      } else if (attempts >= 40) {
        if (pollRef.current) clearInterval(pollRef.current);
        setStage("failed");
        setError(
          "We haven't heard back yet. If you approved the request on your phone, it may still be processing — check back shortly, or try again."
        );
      }
    }, 3000);
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, phoneNumber }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setReference(data.reference);
    setStage("waiting");
    startPolling(data.reference);
  }

  function retry() {
    setStage("form");
    setError(null);
    setReference(null);
  }

  return (
    <div className="bg-paper-white border border-ink-soft/30 rounded-sm p-8">
      <h1 className="font-display text-2xl font-semibold text-chalkboard mb-2">
        {isRenewal ? "Renew your listing" : "Pay to complete registration"}
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        {isRenewal
          ? `${schoolName}'s annual listing fee is due. ${
              currentExpiry ? `Current listing is active until ${new Date(currentExpiry).toLocaleDateString()}.` : ""
            }`
          : `${schoolName} won't be reviewed and published until this year's listing fee is paid.`}
      </p>

      <div className="bg-paper-dark rounded-sm px-4 py-3 mb-6">
        <p className="font-ledger text-xs uppercase tracking-wide text-ink-soft">Annual listing fee</p>
        <p className="font-display text-2xl font-semibold text-chalkboard">{formatUGX(feeUGX)}</p>
      </div>

      {stage === "form" && (
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-soft mb-1">Mobile money number</label>
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0700 000 000 (MTN or Airtel)"
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
            />
          </div>

          {error && <p className="text-sm text-margin-red">{error}</p>}

          <button
            type="submit"
            className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:brightness-110 transition-all"
          >
            Pay {formatUGX(feeUGX)}
          </button>
        </form>
      )}

      {stage === "waiting" && (
        <div className="text-center py-6">
          <p className="font-display text-lg text-chalkboard mb-2">Check your phone</p>
          <p className="text-sm text-ink-soft">
            Approve the payment request with your mobile money PIN. This page will update automatically once it&apos;s confirmed.
          </p>
          {reference && <p className="font-ledger text-xs text-ink-soft/60 mt-4">Ref: {reference}</p>}
        </div>
      )}

      {stage === "success" && (
        <div className="text-center py-6">
          <p className="font-display text-lg text-chalkboard mb-2">Payment received!</p>
          <p className="text-sm text-ink-soft">Taking you back to your schools&hellip;</p>
        </div>
      )}

      {stage === "failed" && (
        <div className="text-center py-6">
          <p className="text-sm text-margin-red mb-4">{error}</p>
          <button
            onClick={retry}
            className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-3 hover:brightness-110 transition-all"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
