"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  schoolId,
  initialFavorited,
  isLoggedIn,
}: {
  schoolId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const method = favorited ? "DELETE" : "POST";
    const res = await fetch(`/api/favorites/${schoolId}`, { method });
    setLoading(false);

    if (res.ok) {
      setFavorited(!favorited);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 font-ledger text-sm transition-colors disabled:opacity-60 ${
        favorited
          ? "bg-margin-red text-paper-white border-margin-red"
          : "bg-transparent text-margin-red border-margin-red hover:bg-margin-red/10"
      }`}
    >
      <span aria-hidden>{favorited ? "♥" : "♡"}</span>
      {favorited ? "Saved" : "Save school"}
    </button>
  );
}
