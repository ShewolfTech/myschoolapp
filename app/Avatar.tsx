export function Avatar({
  name,
  image,
  size = 32,
}: {
  name: string;
  image?: string | null;
  size?: number;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className="rounded-full bg-margin-red text-paper-white font-display font-semibold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
