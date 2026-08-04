import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="bg-chalkboard text-paper-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold">
          My School App Uganda
        </Link>
        <nav className="flex items-center gap-6 text-sm font-ledger">
          <Link href="/schools" className="hover:text-stamp-gold transition-colors">
            Find a school
          </Link>
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
                className="bg-stamp-gold text-ink px-3 py-1.5 rounded-sm hover:brightness-95 transition-all"
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
