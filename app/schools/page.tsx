import { requireAuth } from "@/lib/authHelpers";
import { SchoolsBrowser } from "./SchoolsBrowser";

export default async function SchoolsPage() {
  await requireAuth();

  return <SchoolsBrowser />;
}
