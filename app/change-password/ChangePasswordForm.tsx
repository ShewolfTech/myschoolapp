"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../PasswordInput";
import { PasswordRequirements } from "../PasswordRequirements";
import { isPasswordStrong, PASSWORD_REQUIREMENTS_MESSAGE } from "@/lib/passwordValidation";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm bg-paper-white border border-ink-soft/30 rounded-sm p-8">
      <h1 className="font-display text-2xl font-semibold text-chalkboard mb-6">
        Change password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="currentPassword">
            Current password
          </label>
          <PasswordInput
            id="currentPassword"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="newPassword">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordRequirements password={newPassword} />
        </div>

        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-margin-red">{error}</p>}
        {success && (
          <p className="text-sm text-chalkboard bg-paper-dark rounded-sm px-4 py-3">
            Password changed successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Changing..." : "Change password"}
        </button>
      </form>
    </div>
  );
}
