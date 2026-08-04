/**
 * Run once after seedDistricts.ts to populate sample schools for development.
 * Usage: npx tsx scripts/seedSchools.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { connectDB } from "@/lib/db";
import { District } from "@/models/District";
import { User } from "@/models/User";
import { School } from "@/models/School";
import slugify from "slugify";
import bcrypt from "bcryptjs";

async function getOrCreateSeedAdmin() {
  const email = "seed-admin@schooldirectory.ug";
  let admin = await User.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash("change-this-password", 10);
    admin = await User.create({
      name: "Seed Admin",
      email,
      passwordHash,
      role: "admin",
    });
    console.log("Created seed admin user.");
  }
  return admin;
}

async function findDistrict(name: string, region: string) {
  const district = await District.findOne({ name, region });
  if (!district) {
    throw new Error(
      `District "${name}" in region "${region}" not found — did you run seedDistricts.ts first?`
    );
  }
  return district;
}

const SAMPLE_SCHOOLS = [
  {
    name: "Kampala Parents School",
    region: "Central",
    district: "Kampala",
    ownershipType: "Private",
    levels: ["Nursery", "Primary"],
    boardingType: "Day",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1957,
    description:
      "A long-established primary school in the heart of Kampala known for strong PLE results and a broad extracurricular program.",
    facilities: ["Library", "Computer Lab", "Sports Field", "Music Room"],
    contact: { phone: "+256 414 250 000", email: "info@kps.ac.ug", website: "https://kps.ac.ug" },
    feeStructure: [
      { level: "Primary 7", term: "Term 1", category: "Tuition", amountUGX: 1200000 },
      { level: "Primary 7", term: "Term 1", category: "Requirements", amountUGX: 150000 },
    ],
  },
  {
    name: "Gayaza High School",
    region: "Central",
    district: "Wakiso",
    ownershipType: "Government-Aided",
    levels: ["Secondary"],
    boardingType: "Both",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1905,
    description:
      "One of Uganda's oldest girls' secondary schools, known for academic excellence and a strong boarding tradition.",
    facilities: ["Library", "Science Labs", "Dormitories", "Chapel", "Sports Field"],
    contact: { phone: "+256 414 610 200", email: "admin@gayazahs.ac.ug" },
    feeStructure: [
      { level: "Senior 1", term: "Term 1", category: "Tuition", amountUGX: 980000 },
      { level: "Senior 1", term: "Term 1", category: "Boarding", amountUGX: 650000 },
    ],
  },
  {
    name: "Jinja Progressive Secondary School",
    region: "Eastern",
    district: "Jinja",
    ownershipType: "Private",
    levels: ["Secondary"],
    boardingType: "Day",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1988,
    description: "A day secondary school along the Jinja-Kampala highway with a focus on sciences.",
    facilities: ["Science Labs", "Library", "Sports Field"],
    contact: { phone: "+256 434 120 450", email: "office@jpss.ac.ug" },
    feeStructure: [
      { level: "Senior 3", term: "Term 1", category: "Tuition", amountUGX: 620000 },
    ],
  },
  {
    name: "Mbale Modern Primary School",
    region: "Eastern",
    district: "Mbale",
    ownershipType: "Private",
    levels: ["Nursery", "Primary"],
    boardingType: "Day",
    curriculum: "Uganda National Curriculum",
    foundedYear: 2001,
    description: "A growing primary school serving Mbale town families with small class sizes.",
    facilities: ["Playground", "Library"],
    contact: { phone: "+256 454 433 210" },
    feeStructure: [
      { level: "Primary 4", term: "Term 1", category: "Tuition", amountUGX: 450000 },
    ],
  },
  {
    name: "Tororo Girls' School",
    region: "Eastern",
    district: "Tororo",
    ownershipType: "Government",
    levels: ["Secondary"],
    boardingType: "Boarding",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1961,
    description: "A well-known government girls' boarding school in Eastern Uganda.",
    facilities: ["Dormitories", "Science Labs", "Library", "Sports Field"],
    contact: { phone: "+256 454 440 020" },
    feeStructure: [
      { level: "Senior 2", term: "Term 1", category: "Tuition", amountUGX: 380000 },
      { level: "Senior 2", term: "Term 1", category: "Boarding", amountUGX: 420000 },
    ],
  },
  {
    name: "Gulu Central Primary School",
    region: "Northern",
    district: "Gulu",
    ownershipType: "Government",
    levels: ["Primary"],
    boardingType: "Day",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1945,
    description: "A well-established government primary school in Gulu town.",
    facilities: ["Playground", "Library"],
    contact: { phone: "+256 471 432 100" },
    feeStructure: [
      { level: "Primary 5", term: "Term 1", category: "Tuition", amountUGX: 180000 },
    ],
  },
  {
    name: "Lira Town Academy",
    region: "Northern",
    district: "Lira",
    ownershipType: "Private",
    levels: ["Nursery", "Primary", "Secondary"],
    boardingType: "Both",
    curriculum: "Uganda National Curriculum",
    foundedYear: 2005,
    description: "A combined-level private school offering nursery through secondary in Lira.",
    facilities: ["Science Labs", "Dormitories", "Library", "Computer Lab"],
    contact: { phone: "+256 473 420 900", email: "admissions@liratownacademy.ac.ug" },
    feeStructure: [
      { level: "Senior 1", term: "Term 1", category: "Tuition", amountUGX: 550000 },
      { level: "Senior 1", term: "Term 1", category: "Boarding", amountUGX: 400000 },
    ],
  },
  {
    name: "Arua Hill Secondary School",
    region: "Northern",
    district: "Arua",
    ownershipType: "Government-Aided",
    levels: ["Secondary"],
    boardingType: "Both",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1968,
    description: "A government-aided secondary school serving West Nile sub-region students.",
    facilities: ["Dormitories", "Science Labs", "Sports Field"],
    contact: { phone: "+256 476 420 300" },
    feeStructure: [
      { level: "Senior 4", term: "Term 1", category: "Tuition", amountUGX: 340000 },
    ],
  },
  {
    name: "Mbarara Junior Academy",
    region: "Western",
    district: "Mbarara",
    ownershipType: "Private",
    levels: ["Nursery", "Primary"],
    boardingType: "Day",
    curriculum: "Uganda National Curriculum",
    foundedYear: 2010,
    description: "A modern private primary school in Mbarara municipality.",
    facilities: ["Computer Lab", "Playground", "Library"],
    contact: { phone: "+256 485 421 700", email: "info@mbararajunior.ac.ug" },
    feeStructure: [
      { level: "Primary 3", term: "Term 1", category: "Tuition", amountUGX: 500000 },
    ],
  },
  {
    name: "Kabale Preparatory School",
    region: "Western",
    district: "Kabale",
    ownershipType: "Private",
    levels: ["Nursery", "Primary"],
    boardingType: "Day",
    curriculum: "British",
    foundedYear: 1999,
    description: "A British-curriculum preparatory school in the hills of Kabale.",
    facilities: ["Library", "Computer Lab", "Sports Field"],
    contact: { phone: "+256 486 423 800" },
    feeStructure: [
      { level: "Year 4", term: "Term 1", category: "Tuition", amountUGX: 900000 },
    ],
  },
  {
    name: "Fort Portal Secondary School",
    region: "Western",
    district: "Fort Portal",
    ownershipType: "Government",
    levels: ["Secondary"],
    boardingType: "Boarding",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1952,
    description: "A historic government boarding school in Fort Portal.",
    facilities: ["Dormitories", "Science Labs", "Library", "Sports Field"],
    contact: { phone: "+256 483 422 500" },
    feeStructure: [
      { level: "Senior 3", term: "Term 1", category: "Tuition", amountUGX: 400000 },
      { level: "Senior 3", term: "Term 1", category: "Boarding", amountUGX: 380000 },
    ],
  },
  {
    name: "Kasese Valley College",
    region: "Western",
    district: "Kasese",
    ownershipType: "Private",
    levels: ["Secondary"],
    boardingType: "Both",
    curriculum: "Uganda National Curriculum",
    foundedYear: 1994,
    description: "A private secondary school at the foot of the Rwenzori mountains.",
    facilities: ["Science Labs", "Dormitories", "Sports Field"],
    contact: { phone: "+256 483 444 600" },
    feeStructure: [
      { level: "Senior 2", term: "Term 1", category: "Tuition", amountUGX: 480000 },
    ],
  },
] as const;

async function seed() {
  await connectDB();
  const admin = await getOrCreateSeedAdmin();

  let created = 0;
  let skipped = 0;

  for (const s of SAMPLE_SCHOOLS) {
    const slug = slugify(s.name, { lower: true, strict: true });
    const exists = await School.findOne({ slug });
    if (exists) {
      skipped++;
      continue;
    }

    const district = await findDistrict(s.district, s.region);

    await School.create({
      name: s.name,
      slug,
      region: s.region,
      district: district._id,
      ownershipType: s.ownershipType,
      levels: s.levels,
      boardingType: s.boardingType,
      curriculum: s.curriculum,
      foundedYear: s.foundedYear,
      description: s.description,
      facilities: s.facilities,
      images: [],
      contact: s.contact,
      feeStructure: s.feeStructure,
      status: "approved",
      submittedBy: admin._id,
      verifiedAt: new Date(),
    });
    created++;
  }

  console.log(`Seed complete. Created: ${created}, already existed: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
