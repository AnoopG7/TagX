import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IHealthMetric {
  name: string;
  value: number;
  unit: string;
}

export interface IDeviceHealth extends Document {
  device: Types.ObjectId;
  uptime: number;
  signalStrength: number;
  batteryHealth: number;
  temperature: number;
  memoryUsage?: number;
  connectionErrors?: number;
  firmwareVersion?: string;
  metrics: IHealthMetric[];
  timestamp: Date;
}

const deviceHealthSchema = new Schema<IDeviceHealth>(
  {
    device: {
      type: Schema.Types.ObjectId,
      ref: "TrackingDevice",
      required: [true, "Device reference is required"],
      index: true,
    },
    uptime: {
      type: Number,
      required: [true, "Uptime percentage is required"],
      min: [0, "Uptime cannot be below 0%"],
      max: [100, "Uptime cannot exceed 100%"],
    },
    signalStrength: {
      type: Number,
      required: true,
      min: [0, "Signal strength cannot be below 0"],
      max: [100, "Signal strength cannot exceed 100"],
    },
    batteryHealth: {
      type: Number,
      required: true,
      min: [0, "Battery health cannot be below 0%"],
      max: [100, "Battery health cannot exceed 100%"],
    },
    temperature: {
      type: Number,
      required: true,
    },
    memoryUsage: {
      type: Number,
      min: 0,
      max: 100,
    },
    connectionErrors: {
      type: Number,
      min: 0,
      default: 0,
    },
    firmwareVersion: {
      type: String,
    },
    metrics: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        unit: { type: String, default: "" },
      },
    ],
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

deviceHealthSchema.index({ device: 1, timestamp: -1 });
deviceHealthSchema.index({ device: 1, firmwareVersion: 1 });

export const DeviceHealth = mongoose.model<IDeviceHealth>(
  "DeviceHealth",
  deviceHealthSchema
);
