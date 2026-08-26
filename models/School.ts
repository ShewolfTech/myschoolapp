import mongoose, { Schema, models, model } from "mongoose";
import { REGIONS } from "@/data/regionsAndDistricts";

export const OWNERSHIP_TYPES = ["Government", "Private", "Government-Aided"] as const;
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];

export const SCHOOL_LEVELS = ["Nursery", "Primary", "Secondary"] as const;
export type SchoolLevel = (typeof SCHOOL_LEVELS)[number];

export const BOARDING_TYPES = ["Day", "Boarding", "Both"] as const;
export type BoardingType = (typeof BOARDING_TYPES)[number];

export const CURRICULUM_TYPES = [
  "Uganda National Curriculum",
  "British",
  "American",
  "Other",
] as const;
export type CurriculumType = (typeof CURRICULUM_TYPES)[number];

export const SCHOOL_STATUS = ["pending", "approved", "rejected"] as const;
export type SchoolStatus = (typeof SCHOOL_STATUS)[number];

/** One line item in the fee structure, e.g. "Senior 1, Term 1, Tuition, 450000" */
export interface IFeeItem {
  level: string; // e.g. "Primary 1", "Senior 3" — free text since classes vary by level
  term: "Term 1" | "Term 2" | "Term 3" | "Annual";
  category: string; // e.g. "Tuition", "Boarding", "Uniform", "Requirements"
  amountUGX: number;
  notes?: string;
}

export interface ISchool {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;

  region: (typeof REGIONS)[number];
  district: mongoose.Types.ObjectId; // ref District
  subCounty?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };

  ownershipType: OwnershipType;
  levels: SchoolLevel[];
  boardingType: BoardingType;
  curriculum: CurriculumType;
  foundedYear?: number;

  description?: string;
  facilities: string[]; // e.g. ["Library", "Science Lab", "Dormitories", "Sports field"]
  images: string[]; // URLs (e.g. Cloudinary)
  video?: string;

  contact: {
    phone: string;
    email?: string;
    website?: string;
  };

  feeStructure: IFeeItem[];

  // Approval workflow
  status: SchoolStatus;
  submittedBy: mongoose.Types.ObjectId; // ref User (school_rep)
  rejectionReason?: string;
  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const FeeItemSchema = new Schema<IFeeItem>(
  {
    level: { type: String, required: true, trim: true },
    term: {
      type: String,
      enum: ["Term 1", "Term 2", "Term 3", "Annual"],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    amountUGX: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    region: { type: String, enum: REGIONS, required: true },
    district: { type: Schema.Types.ObjectId, ref: "District", required: true },
    subCounty: { type: String, trim: true },
    address: { type: String, trim: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    ownershipType: { type: String, enum: OWNERSHIP_TYPES, required: true },
    levels: [{ type: String, enum: SCHOOL_LEVELS, required: true }],
    boardingType: { type: String, enum: BOARDING_TYPES, required: true },
    curriculum: { type: String, enum: CURRICULUM_TYPES, default: "Uganda National Curriculum" },
    foundedYear: { type: Number },

    description: { type: String, trim: true },
    facilities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    video: { type: String, trim: true },

    contact: {
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      website: { type: String, trim: true },
    },

    feeStructure: [FeeItemSchema],

    status: {
      type: String,
      enum: SCHOOL_STATUS,
      default: "pending",
      required: true,
    },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rejectionReason: { type: String, trim: true },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

// Search & filter performance indexes
SchoolSchema.index({ name: "text" }); // free-text search by name
SchoolSchema.index({ region: 1, district: 1 });
SchoolSchema.index({ ownershipType: 1 });
SchoolSchema.index({ status: 1 });

export const School = models.School || model<ISchool>("School", SchoolSchema);

export default School;
