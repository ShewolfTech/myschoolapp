import mongoose, { Schema, models, model } from "mongoose";
import { REGIONS } from "@/data/regionsAndDistricts";

export interface IDistrict {
  _id: mongoose.Types.ObjectId;
  name: string;
  region: (typeof REGIONS)[number];
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      enum: REGIONS,
    },
  },
  { timestamps: true }
);

// A district name should be unique within its region (avoids duplicate seeding)
DistrictSchema.index({ name: 1, region: 1 }, { unique: true });

export const District =
  models.District || model<IDistrict>("District", DistrictSchema);

export default District;
