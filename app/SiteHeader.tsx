import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="bg-chalkboard text-paper-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="MySchoolApp Uganda"
            className="w-9 h-9 shrink-0 object-contain"
          />
          <span className="font-display text-xl font-semibold">
            MySchoolApp
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-ledger">
          {session?.user && (
            <Link href="/schools" className="hover:text-stamp-gold transition-colors">
              Find a school
            </Link>
          )}
          {session?.user?.role === "parent" && (
            <Link href="/favorites" className="hover:text-stamp-gold transition-colors">
              Saved schools
            </Link>
          )}
          {session?.user?.role === "school_rep" && (
            <Link href="/register-school" className="hover:text-stamp-gold transition-colors">
              My school
            </Link>
          )}
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="hover:text-stamp-gold transition-colors">
              Admin
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/change-password" className="hover:text-stamp-gold transition-colors">
                Change password
              </Link>
              <span className="text-paper-white/70">
                {session.user.name} &middot; {session.user.role}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-stamp-gold transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-paper-white text-chalkboard px-3 py-1.5 rounded-sm hover:brightness-95 transition-all font-semibold"
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
