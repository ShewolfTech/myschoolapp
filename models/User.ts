import mongoose, { Schema, models, model } from "mongoose";

export const USER_ROLES = ["parent", "school_rep", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image?: string;
  passwordHash: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  verifyEmailTokenHash?: string;
  verifyEmailExpires?: Date;
  role: UserRole;

  // Parents only: schools they've saved/favorited
  favorites: mongoose.Types.ObjectId[];

  // School reps only: the school(s) they manage/submitted.
  // A rep usually manages one school, but the array keeps it flexible
  // (e.g. someone managing a chain of campuses).
  managedSchools: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },
    passwordHash: { type: String, required: true, select: false }, // select:false so it's never returned by default queries
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    verifyEmailTokenHash: { type: String, select: false },
    verifyEmailExpires: { type: Date, select: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "parent",
      required: true,
    },

    favorites: [{ type: Schema.Types.ObjectId, ref: "School", default: [] }],

    managedSchools: [{ type: Schema.Types.ObjectId, ref: "School", default: [] }],
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);

export default User;
