import { requireRole } from "@/lib/authHelpers";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  await requireRole(["admin"]);

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-on-navy mb-6">
        Admin: school submissions
      </h1>
      <AdminDashboard />
    </main>
  );
}
