/**
 * Promote an existing user (who has already signed up normally) to admin.
 * Usage: npx tsx scripts/makeAdmin.ts someone@example.com
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/makeAdmin.ts <email>");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email "${email}". Sign up with that email first, then run this script.`);
    process.exit(1);
  }

  console.log(`${user.email} is now an admin.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
