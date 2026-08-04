import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/models/User";

/**
 * Use in server components to guard a page by role.
 * Redirects to /login if not signed in, or to / if signed in with the wrong role.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    redirect("/");
  }

  return session;
}
