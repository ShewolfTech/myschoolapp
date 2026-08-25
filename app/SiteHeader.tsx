import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="bg-chalkboard text-paper-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/*
            LOGO PLACEHOLDER
            Once you have a real logo file, replace this div with:
            <Image src="/logo.png" alt="School Directory Uganda" width={36} height={36} />
            (import Image from "next/image" at the top of this file)
            Drop the logo file at: public/logo.png
          */}
          <div className="w-9 h-9 shrink-0 rounded-sm border-2 border-dashed border-paper-white/50 flex items-center justify-center">
            <span className="font-ledger text-[9px] uppercase tracking-wide text-paper-white/60">
              Logo
            </span>
          </div>
          <span className="font-display text-xl font-semibold">
            School Directory Uganda
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
