import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ResendVerificationButton } from "./ResendVerificationButton";

export async function EmailVerificationBanner() {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();
  const user = await User.findById(session.user.id).select("emailVerified").lean();
  if (!user || user.emailVerified) return null;

  return (
    <div className="bg-stamp-gold text-ink px-6 py-2 text-sm flex flex-wrap items-center justify-center gap-2 text-center">
      <span>
        Please verify your email to unlock all features (saving schools, registering a school).
      </span>
      <ResendVerificationButton />
    </div>
  );
}
