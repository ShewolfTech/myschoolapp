"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews/${schoolId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.review) {
          setHasExisting(true);
          setRating(data.review.rating);
          setComment(data.review.comment ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [schoolId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/reviews/${schoolId}`, {
      method: hasExisting ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setHasExisting(true);
    setSuccess(true);
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-ink-soft">Loading&hellip;</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink-soft/30 rounded-sm p-5">
      <h3 className="font-display text-base font-semibold text-chalkboard mb-3">
        {hasExisting ? "Edit your review" : "Leave a review"}
      </h3>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="text-2xl leading-none"
          >
            <span
              className={
                star <= (hoverRating || rating) ? "text-margin-red" : "text-ink-soft/30"
              }
            >
              &#9733;
            </span>
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this school (optional)"
        className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard mb-3"
      />

      {error && <p className="text-sm text-margin-red mb-3">{error}</p>}
      {success && (
        <p className="text-sm text-chalkboard bg-paper-dark rounded-sm px-3 py-2 mb-3">
          Review saved.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-5 py-2 hover:brightness-110 transition-all disabled:opacity-60"
      >
        {submitting ? "Saving..." : hasExisting ? "Save changes" : "Submit review"}
      </button>
    </form>
  );
}
