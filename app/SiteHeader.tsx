import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="bg-chalkboard text-paper-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="MySchoolApp Uganda"
              className="
                w-8 h-8
                sm:w-9 sm:h-9
                shrink-0
                object-contain
              "
            />

            <span
              className="
                font-display
                text-lg
                sm:text-xl
                font-semibold
                whitespace-nowrap
              "
            >
              MySchoolApp
            </span>
          </Link>

          {/* ========================= */}
          {/* Desktop navigation */}
          {/* ========================= */}

          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-ledger">
            {session?.user && (
              <Link
                href="/schools"
                className="hover:text-stamp-gold transition-colors whitespace-nowrap"
              >
                Find a school
              </Link>
            )}

            {session?.user?.role === "parent" && (
              <Link
                href="/favorites"
                className="hover:text-stamp-gold transition-colors whitespace-nowrap"
              >
                Saved schools
              </Link>
            )}

            {session?.user?.role === "school_rep" && (
              <Link
                href="/register-school"
                className="hover:text-stamp-gold transition-colors whitespace-nowrap"
              >
                My school
              </Link>
            )}

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="hover:text-stamp-gold transition-colors whitespace-nowrap"
              >
                Admin
              </Link>
            )}

            {session?.user ? (
              <>
                <Link
                  href="/change-password"
                  className="hover:text-stamp-gold transition-colors whitespace-nowrap"
                >
                  Change password
                </Link>

                <span className="text-paper-white/70 whitespace-nowrap">
                  {session.user.name} &middot; {session.user.role}
                </span>

                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-stamp-gold transition-colors whitespace-nowrap"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className="
                    bg-paper-white
                    text-chalkboard
                    px-3
                    py-1.5
                    rounded-sm
                    hover:brightness-95
                    transition-all
                    font-semibold
                    whitespace-nowrap
                  "
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* ========================= */}
          {/* Mobile navigation */}
          {/* ========================= */}

          <details className="relative md:hidden group">
            <summary
              className="
                list-none
                cursor-pointer
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-md
                border
                border-paper-white/20
                hover:bg-paper-white/10
                transition-colors
              "
              aria-label="Open navigation menu"
            >
              {/* Hamburger */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-open:hidden"
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>

              {/* Close icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden group-open:block"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </summary>

            <nav
              className="
                absolute
                right-0
                top-12
                w-64
                bg-chalkboard
                border
                border-paper-white/15
                shadow-xl
                rounded-md
                overflow-hidden
                font-ledger
                text-sm
              "
            >
              <div className="flex flex-col p-2">
                {session?.user && (
                  <Link
                    href="/schools"
                    className="
                      px-4
                      py-3
                      rounded
                      hover:bg-paper-white/10
                      hover:text-stamp-gold
                      transition-colors
                    "
                  >
                    Find a school
                  </Link>
                )}

                {session?.user?.role === "parent" && (
                  <Link
                    href="/favorites"
                    className="
                      px-4
                      py-3
                      rounded
                      hover:bg-paper-white/10
                      hover:text-stamp-gold
                      transition-colors
                    "
                  >
                    Saved schools
                  </Link>
                )}

                {session?.user?.role === "school_rep" && (
                  <Link
                    href="/register-school"
                    className="
                      px-4
                      py-3
                      rounded
                      hover:bg-paper-white/10
                      hover:text-stamp-gold
                      transition-colors
                    "
                  >
                    My school
                  </Link>
                )}

                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="
                      px-4
                      py-3
                      rounded
                      hover:bg-paper-white/10
                      hover:text-stamp-gold
                      transition-colors
                    "
                  >
                    Admin
                  </Link>
                )}

                {session?.user ? (
                  <>
                    <div className="my-1 border-t border-paper-white/10" />

                    <div className="px-4 py-3">
                      <p className="text-paper-white font-medium truncate">
                        {session.user.name}
                      </p>

                      <p className="text-xs text-paper-white/60 mt-0.5 capitalize">
                        {session.user.role}
                      </p>
                    </div>

                    <Link
                      href="/change-password"
                      className="
                        px-4
                        py-3
                        rounded
                        hover:bg-paper-white/10
                        hover:text-stamp-gold
                        transition-colors
                      "
                    >
                      Change password
                    </Link>

                    <div className="px-4 py-3">
                      <SignOutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="
                        px-4
                        py-3
                        rounded
                        hover:bg-paper-white/10
                        hover:text-stamp-gold
                        transition-colors
                      "
                    >
                      Log in
                    </Link>

                    <div className="p-2">
                      <Link
                        href="/signup"
                        className="
                          block
                          w-full
                          text-center
                          bg-paper-white
                          text-chalkboard
                          px-4
                          py-2.5
                          rounded-sm
                          font-semibold
                          hover:brightness-95
                          transition-all
                        "
                      >
                        Sign up
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
