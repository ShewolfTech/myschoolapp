import mongoose, { Schema, models, model } from "mongoose";

// "pending" is a transitional role: assigned automatically to someone who
// signs up via Google (or another OAuth provider) before they've chosen
// whether they're a parent or a school rep. It's never a permanent state —
// middleware redirects anyone with this role to /complete-profile until
// they pick a real role.
export const USER_ROLES = ["parent", "school_rep", "admin", "pending"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image?: string;
  // Optional because OAuth-created accounts (e.g. Google) never set a
  // local password — they authenticate entirely through the provider.
  passwordHash?: string;
  role: UserRole;
  favorites: mongoose.Types.ObjectId[];
  managedSchools: mongoose.Types.ObjectId[];
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  verifyEmailTokenHash?: string;
  verifyEmailExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: USER_ROLES, default: "parent", required: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "School", default: [] }],
    managedSchools: [{ type: Schema.Types.ObjectId, ref: "School", default: [] }],
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    verifyEmailTokenHash: { type: String, select: false },
    verifyEmailExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
export default User;
