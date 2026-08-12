"use client";

import { useEffect, useState } from "react";
import { SchoolResults, SchoolListItem } from "@/app/schools/SchoolResults";

export function FavoritesList() {
  const [favorites, setFavorites] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && favorites.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-xl text-chalkboard mb-2">
          No saved schools yet.
        </p>
        <p className="text-ink-soft text-sm">
          Browse schools and tap &ldquo;Save school&rdquo; on any listing to
          add it here.
        </p>
      </div>
    );
  }

  return <SchoolResults schools={favorites} loading={loading} />;
}
