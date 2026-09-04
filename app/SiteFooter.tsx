import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-chalkboard text-paper-white mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-ledger text-xs text-paper-white/80">
          &copy; {new Date().getFullYear()} MySchoolApp Uganda. All rights reserved.
        </p>

        <nav
          aria-label="Legal"
          className="flex items-center gap-4 font-ledger text-xs"
        >
          <Link
            href="/privacy-policy"
            className="text-paper-white/70 hover:text-paper-white transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>

          <span className="text-paper-white/30">|</span>

          <Link
            href="/terms-of-use"
            className="text-paper-white/70 hover:text-paper-white transition-colors underline-offset-4 hover:underline"
          >
            Terms of Use
          </Link>
        </nav>

        <p className="font-ledger text-xs text-paper-white/60">
          Find. Compare. Choose.
        </p>
      </div>
    </footer>
  );
}