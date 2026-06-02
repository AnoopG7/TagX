import mongoose, { Schema, type Document, type Types } from "mongoose";

export type AlertSeverity = "info" | "warning" | "critical";

export interface IPrivacyAlert extends Document {
  user: Types.ObjectId;
  device?: Types.ObjectId;
  severity: AlertSeverity;
  title: string;
  description: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  actionLabel?: string;
  actionUrl?: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

const privacyAlertSchema = new Schema<IPrivacyAlert>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: "TrackingDevice",
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: {
        values: ["info", "warning", "critical"],
        message: "{VALUE} is not a valid severity level",
      },
    },
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Alert description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    location: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    actionLabel: {
      type: String,
      trim: true,
    },
    actionUrl: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

privacyAlertSchema.index({ user: 1, timestamp: -1 });
privacyAlertSchema.index({ user: 1, severity: 1, timestamp: -1 });
privacyAlertSchema.index({ user: 1, resolved: 1 });
privacyAlertSchema.index({ device: 1 });

export const PrivacyAlert = mongoose.model<IPrivacyAlert>(
  "PrivacyAlert",
  privacyAlertSchema
);
