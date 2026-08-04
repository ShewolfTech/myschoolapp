import mongoose, { Schema, models, model } from "mongoose";

export const INQUIRY_STATUS = ["new", "responded", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUS)[number];

export interface IInquiry {
  _id: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId; // ref School

  // Not all parents will be logged in, so we store contact details directly
  // rather than only relying on a User reference.
  parentUser?: mongoose.Types.ObjectId | null; // ref User, if logged in
  parentName: string;
  parentContact: string; // phone or email, whichever they gave
  message: string;

  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    parentUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    parentName: { type: String, required: true, trim: true },
    parentContact: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: INQUIRY_STATUS,
      default: "new",
      required: true,
    },
  },
  { timestamps: true }
);

InquirySchema.index({ school: 1, createdAt: -1 });

export const Inquiry = models.Inquiry || model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
