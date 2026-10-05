import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "./UserMenu";

function getPrimaryLink(role?: string): { href: string; label: string } {
  if (role === "school_rep") return { href: "/register-school", label: "My school" };
  if (role === "admin") return { href: "/admin", label: "Admin" };
  // Parents, and the transitional "pending" role before they've chosen,
  // both land on the public browse page.
  return { href: "/schools", label: "Find a school" };
}

export async function SiteHeader() {
  const session = await auth();
  const primary = session?.user ? getPrimaryLink(session.user.role) : null;

  return (
    <header className="bg-chalkboard text-paper-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="MySchoolApp Uganda"
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 object-contain"
          />
          <span className="font-display text-base sm:text-xl font-semibold whitespace-nowrap">
            MySchoolApp
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-ledger">
          {primary && (
            <Link href={primary.href} className="hover:text-stamp-gold transition-colors whitespace-nowrap">
              {primary.label}
            </Link>
          )}

          {session?.user ? (
            <UserMenu
              name={session.user.name ?? "?"}
              image={session.user.image ?? null}
              role={session.user.role}
            />
          ) : (
            <>
              <Link href="/login" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-paper-white text-chalkboard px-2.5 sm:px-3 py-1.5 rounded-sm hover:brightness-95 transition-all whitespace-nowrap"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
