import mongoose, { Schema, type Document } from "mongoose";

export type OTPPurpose = "email_verification" | "password_reset" | "login";

export interface IOTP extends Document {
  email: string;
  otp: string;
  purpose: OTPPurpose;
  attempts: number;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    purpose: {
      type: String,
      required: true,
      enum: {
        values: ["email_verification", "password_reset", "login"],
        message: "{VALUE} is not a valid OTP purpose",
      },
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ email: 1, createdAt: -1 });

export const OTP = mongoose.model<IOTP>("OTP", otpSchema);
