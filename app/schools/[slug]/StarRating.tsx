export function StarRating({ rating, size = "text-base" }: { rating: number; size?: string }) {
  return (
    <span className={size} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "text-margin-red" : "text-ink-soft/30"}>
          &#9733;
        </span>
      ))}
    </span>
  );
}
