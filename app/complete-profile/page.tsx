import { requireAuth } from "@/lib/authHelpers";
import { CompleteProfileForm } from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
  await requireAuth();

  return <CompleteProfileForm />;
}
