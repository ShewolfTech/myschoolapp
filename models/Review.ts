import mongoose, { Schema, models, model } from "mongoose";

export interface IReview {
  _id: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per user per school — enforced at the database level.
ReviewSchema.index({ school: 1, user: 1 }, { unique: true });
ReviewSchema.index({ school: 1, createdAt: -1 });

export const Review = models.Review || model<IReview>("Review", ReviewSchema);
export default Review;
