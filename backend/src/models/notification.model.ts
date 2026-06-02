import mongoose, { Schema, type Document, type Types } from "mongoose";

export type NotificationType = "location" | "security" | "insight" | "reminder" | "system";
export type NotificationPriority = "low" | "normal" | "high" | "critical";

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  read: boolean;
  readAt?: Date;
  actionable: boolean;
  actionLabel?: string;
  actionUrl?: string;
  category?: string;
  expiresAt?: Date;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: ["location", "security", "insight", "reminder", "system"],
        message: "{VALUE} is not a valid notification type",
      },
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "normal", "high", "critical"],
        message: "{VALUE} is not a valid priority",
      },
      default: "normal",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Notification description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    actionable: {
      type: Boolean,
      default: false,
    },
    actionLabel: {
      type: String,
      trim: true,
    },
    actionUrl: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
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

notificationSchema.index({ user: 1, timestamp: -1 });
notificationSchema.index({ user: 1, read: 1, timestamp: -1 });
notificationSchema.index({ user: 1, type: 1, timestamp: -1 });
notificationSchema.index({ user: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
