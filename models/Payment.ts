import mongoose, { Schema, models, model } from "mongoose";

export const PAYMENT_STATUS = ["pending", "successful", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_TYPE = ["initial", "renewal"] as const;
export type PaymentType = (typeof PAYMENT_TYPE)[number];

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: PaymentType;
  amountUGX: number;
  phoneNumber: string;
  // Our own unique reference, generated before calling Relworx — this is
  // what ties an incoming webhook callback back to this record.
  reference: string;
  // Relworx's own reference for this transaction, returned from the
  // initiate call — needed for status-check polling.
  providerReference?: string;
  status: PaymentStatus;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: PAYMENT_TYPE, required: true },
    amountUGX: { type: Number, required: true, min: 0 },
    phoneNumber: { type: String, required: true, trim: true },
    reference: { type: String, required: true, unique: true },
    providerReference: { type: String, trim: true },
    status: { type: String, enum: PAYMENT_STATUS, default: "pending", required: true },
    failureReason: { type: String, trim: true },
  },
  { timestamps: true }
);

PaymentSchema.index({ school: 1, createdAt: -1 });
PaymentSchema.index({ providerReference: 1 });

export const Payment = models.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
