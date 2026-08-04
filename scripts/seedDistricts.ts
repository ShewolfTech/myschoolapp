/**
 * Run once to populate the District collection.
 * Usage: npx tsx scripts/seedDistricts.ts
 * (or add as a package.json script: "seed:districts": "tsx scripts/seedDistricts.ts")
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { connectDB } from "@/lib/db";
import { District } from "@/models/District";
import { FLAT_DISTRICT_LIST } from "@/data/regionsAndDistricts";

async function seed() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const { region, district } of FLAT_DISTRICT_LIST) {
    const exists = await District.findOne({ name: district, region });
    if (exists) {
      skipped++;
      continue;
    }
    await District.create({ name: district, region });
    created++;
  }

  console.log(`Seed complete. Created: ${created}, already existed: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
