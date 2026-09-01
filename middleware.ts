import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const EXEMPT_PREFIXES = [
  "/complete-profile",
  "/api",
  "/_next",
  "/favicon.ico",
  "/manifest.json",
  "/sw.js",
  "/icons",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isExempt = EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (role === "pending" && !isExempt) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }
});

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
