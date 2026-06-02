import mongoose, { Schema, type Document, type Types } from "mongoose";

export type EventType = "location" | "connection" | "alert" | "status";
export type EventSeverity = "info" | "warning" | "error" | "critical";
export type EventIcon = "map-pin" | "bluetooth" | "wifi" | "power" | "alert";
export type EventSource = "bluetooth" | "gps" | "crowd" | "manual" | "system";

export interface ITrackingEvent extends Document {
  device: Types.ObjectId;
  type: EventType;
  severity: EventSeverity;
  title: string;
  description: string;
  icon: EventIcon;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  source: EventSource;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const trackingEventSchema = new Schema<ITrackingEvent>(
  {
    device: {
      type: Schema.Types.ObjectId,
      ref: "TrackingDevice",
      required: [true, "Device reference is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["location", "connection", "alert", "status"],
        message: "{VALUE} is not a valid event type",
      },
    },
    severity: {
      type: String,
      enum: {
        values: ["info", "warning", "error", "critical"],
        message: "{VALUE} is not a valid severity level",
      },
      default: "info",
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Event icon is required"],
      enum: {
        values: ["map-pin", "bluetooth", "wifi", "power", "alert"],
        message: "{VALUE} is not a valid icon",
      },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String, trim: true },
    },
    source: {
      type: String,
      enum: {
        values: ["bluetooth", "gps", "crowd", "manual", "system"],
        message: "{VALUE} is not a valid event source",
      },
      default: "bluetooth",
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

trackingEventSchema.index({ device: 1, timestamp: -1 });
trackingEventSchema.index({ device: 1, type: 1, timestamp: -1 });
trackingEventSchema.index({ device: 1, severity: 1, timestamp: -1 });
trackingEventSchema.index({ timestamp: -1 });
trackingEventSchema.index({ type: 1, severity: 1 });

export const TrackingEvent = mongoose.model<ITrackingEvent>(
  "TrackingEvent",
  trackingEventSchema
);
