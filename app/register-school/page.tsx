import { requireRole } from "@/lib/authHelpers";
import { RegisterSchoolForm } from "./RegisterSchoolForm";

export default async function RegisterSchoolPage() {
  await requireRole(["school_rep"]);

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
      <RegisterSchoolForm />
    </main>
  );
}
