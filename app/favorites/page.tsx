import { requireAuth } from "@/lib/authHelpers";
import { FavoritesList } from "./FavoritesList";

export default async function FavoritesPage() {
  await requireAuth();

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-chalkboard mb-1">
        Saved schools
      </h1>
      <p className="text-ink-soft mb-8">Schools you&apos;ve bookmarked to compare later.</p>
      <FavoritesList />
    </main>
  );
}
