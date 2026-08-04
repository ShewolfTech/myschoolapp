import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="font-ledger text-sm tracking-widest uppercase text-ruled-blue mb-4">
          Uganda &middot; all 4 regions
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-chalkboard leading-tight max-w-3xl">
          Every school your child could go to, not just the ones you&apos;ve
          heard of.
        </h1>
        <p className="mt-6 max-w-xl text-ink-soft text-lg">
          Search government and private schools by district, level, and fees
          &mdash; across Central, Eastern, Northern, and Western Uganda.
        </p>
        <Link
          href="/schools"
          className="mt-10 inline-flex items-center gap-2 rounded-sm bg-chalkboard px-8 py-4 font-display text-lg font-semibold text-paper-white hover:bg-chalkboard-dark transition-colors"
        >
          Find a school
        </Link>
      </section>

      <section className="border-t border-dashed border-ink-soft/40 px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {["Central", "Eastern", "Northern", "Western"].map((region) => (
            <Link
              key={region}
              href={`/schools?region=${region}`}
              className="font-display text-xl font-semibold text-chalkboard hover:text-margin-red transition-colors"
            >
              {region}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
