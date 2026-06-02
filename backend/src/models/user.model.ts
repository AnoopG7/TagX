import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export type UserRole = "user" | "admin" | "superadmin";

export interface IUserPreferences {
  theme: "dark" | "light" | "system";
  notifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  language: string;
  timezone: string;
  privacyScanEnabled: boolean;
}

export interface IUserAvatar {
  url: string;
  publicId: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: IUserAvatar;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
  preferences: IUserPreferences;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superadmin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    preferences: {
      theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
      notifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Asia/Kolkata" },
      privacyScanEnabled: { type: Boolean, default: true },
    },
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        const fieldsToDelete = ["__v", "password", "refreshToken", "passwordResetToken", "passwordResetExpires"];
        for (const field of fieldsToDelete) {
          delete ret[field];
        }
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
