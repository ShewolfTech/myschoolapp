import { notFound } from "next/navigation";
import { requireRole } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { School } from "@/models/School";
import "@/models/District";
import { RegisterSchoolForm } from "../../RegisterSchoolForm";

export default async function EditSchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["school_rep"]);
  const { id } = await params;

  await connectDB();

  const user = await User.findById(session.user.id).select("managedSchools");
  const owns = user?.managedSchools?.some(
    (sid: { toString(): string }) => sid.toString() === id
  );
  if (!owns) {
    notFound();
  }

  const school = await School.findById(id).populate("district", "name").lean();
  if (!school) {
    notFound();
  }

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
      <RegisterSchoolForm mode="edit" schoolId={id} initialSchool={JSON.parse(JSON.stringify(school))} />
    </main>
  );
}
