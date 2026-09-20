import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";
import { Avatar } from "./Avatar";

export async function SiteHeader() {
  const session = await auth();

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
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-ledger">
          {session?.user && (
            <Link href="/schools" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
              Find a school
            </Link>
          )}
          {session?.user?.role === "parent" && (
            <Link href="/favorites" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
              Saved schools
            </Link>
          )}
          {session?.user?.role === "school_rep" && (
            <Link href="/register-school" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
              My school
            </Link>
          )}
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
              Admin
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/change-password" className="hover:text-stamp-gold transition-colors whitespace-nowrap">
                Change password
              </Link>
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar name={session.user.name ?? "?"} image={session.user.image} size={24} />
                <span className="text-paper-white/70 whitespace-nowrap hidden sm:inline">
                  {session.user.name}
                </span>
              </Link>
              <SignOutButton />
            </>
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
