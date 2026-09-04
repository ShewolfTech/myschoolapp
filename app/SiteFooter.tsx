export function SiteFooter() {
  return (
    <footer className="bg-chalkboard text-paper-white mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-ledger text-xs text-paper-white/80">
          &copy; {new Date().getFullYear()} MySchoolApp Uganda. All rights reserved.
        </p>
        <p className="font-ledger text-xs text-paper-white/60">
          Find. Compare. Choose.
        </p>
      </div>
    </footer>
  );
}
