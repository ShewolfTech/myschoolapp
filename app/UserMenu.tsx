"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar } from "./Avatar";

interface DropdownLink {
  href: string;
  label: string;
}

function getDropdownLinks(role: string): DropdownLink[] {
  const links: DropdownLink[] = [];

  // "Find a school" is each non-parent role's secondary link — parents
  // already have it as their one primary nav item, so it's omitted here
  // to avoid showing it twice.
  if (role !== "parent") {
    links.push({ href: "/schools", label: "Find a school" });
  }
  if (role === "parent") {
    links.push({ href: "/favorites", label: "Saved schools" });
  }

  links.push({ href: "/profile", label: "My profile" });
  links.push({ href: "/change-password", label: "Change password" });

  return links;
}

function roleLabel(role: string): string {
  if (role === "school_rep") return "school rep";
  return role;
}

export function UserMenu({
  name,
  image,
  role,
}: {
  name: string;
  image: string | null;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const links = getDropdownLinks(role);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Avatar name={name || "?"} image={image} size={28} />
        <span className="text-paper-white/80 whitespace-nowrap hidden sm:inline text-sm">
          {name}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-paper-white/60 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-paper-white border border-ink-soft/20 rounded-sm shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-dashed border-ink-soft/20">
            <p className="font-display text-sm font-semibold text-chalkboard truncate">{name}</p>
            <p className="font-ledger text-xs text-ink-soft capitalize">{roleLabel(role)}</p>
          </div>

          <nav className="py-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-ink hover:bg-paper-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-dashed border-ink-soft/20 py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 text-sm text-margin-red hover:bg-paper-dark transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
