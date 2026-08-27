import { requireAuth } from "@/lib/authHelpers";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  await requireAuth();

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <ChangePasswordForm />
    </main>
  );
}
