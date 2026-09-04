import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    const destination =
      session.user.role === "school_rep"
        ? "/register-school"
        : session.user.role === "admin"
        ? "/admin"
        : "/schools";
    redirect(destination);
  }

  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col lg:flex-row items-center gap-12 px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="flex-1">
          <span className="font-ledger text-sm tracking-widest uppercase text-on-navy-soft mb-4 block">
            Uganda &middot; all 4 regions
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-on-navy leading-tight mb-6">
            Every school your child could go to, not just the ones you&apos;ve heard of.
          </h1>
          <p className="text-on-navy-soft text-lg mb-8 max-w-xl">
            MySchoolApp Uganda lets you search government and private
            schools by region, district, level, and fees &mdash; so you&apos;re
            not limited to only the schools you already know about. Create a
            free account to start browsing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-sm bg-chalkboard px-8 py-4 font-display text-lg font-semibold text-paper-white hover:brightness-110 transition-all"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-sm border-2 border-paper-white text-on-navy px-8 py-4 font-display text-lg font-semibold hover:bg-paper-white/10 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full">
          {/*
            PHOTO PLACEHOLDER
            Swap this div for a real photo once you have one properly
            licensed (e.g. from Unsplash/Pexels) or your own photography.
            If the photo includes identifiable children, get a signed
            model release/parental consent before publishing it publicly.

            Replace with:
            <Image src="/images/hero.jpg" alt="..." width={600} height={450}
              className="rounded-sm w-full h-auto object-cover" />
            Drop the file at: public/images/hero.jpg
          */}
          <div className="aspect-[4/3] w-full rounded-sm border-2 border-dashed bg-chalkboard flex flex-col items-center justify-center gap-2 text-center px-6">
            <img src="logo.jpg" alt="..." width={600} height={450}
              className="rounded-sm w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      <section className="border-t border-dashed border-paper-white/20 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-xl font-semibold text-on-navy mb-2">
              Search every region
            </p>
            <p className="text-on-navy-soft text-sm">
              Central, Eastern, Northern, and Western Uganda &mdash; not just
              the schools near you.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-on-navy mb-2">
              See real fees upfront
            </p>
            <p className="text-on-navy-soft text-sm">
              Fee structures by level and term, so there are no surprises
              before you reach out.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-on-navy mb-2">
              Verified listings
            </p>
            <p className="text-on-navy-soft text-sm">
              Every school is reviewed before it appears in search results.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
