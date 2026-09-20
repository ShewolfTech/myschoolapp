import { requireAuth } from "@/lib/authHelpers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await requireAuth();

  await connectDB();
  const user = await User.findById(session.user.id).select("name image").lean();

  return (
    <main className="flex-1 max-w-md w-full mx-auto px-6 py-10">
      <ProfileForm currentName={user?.name ?? ""} currentImage={user?.image ?? null} />
    </main>
  );
}
