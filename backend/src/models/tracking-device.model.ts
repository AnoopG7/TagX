import mongoose, { Schema, type Document, type Types } from "mongoose";

export type DeviceType = "tag" | "phone" | "wallet" | "pet" | "key";
export type DeviceStatus = "active" | "idle" | "offline" | "low_battery";

export interface IDeviceLocation {
  lat: number;
  lng: number;
  address?: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export interface IDeviceSettings {
  notifyOnLeftBehind: boolean;
  notifyOnLowBattery: boolean;
  notifyOnDisconnect: boolean;
  geofenceRadius: number;
  trackingInterval: number;
  precisionFindingEnabled: boolean;
  ledIndicator: boolean;
}

export interface ITrackingDevice extends Document {
  user: Types.ObjectId;
  name: string;
  type: DeviceType;
  serialNumber: string;
  status: DeviceStatus;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
  firmwareVersion: string;
  hardwareVersion?: string;
  manufacturer?: string;
  deviceModel?: string;
  temperature: number;
  isActive: boolean;
  pairedAt: Date;
  lastIpAddress?: string;
  location?: IDeviceLocation;
  settings: IDeviceSettings;
  metadata: Record<string, unknown>;
}

const trackingDeviceSchema = new Schema<ITrackingDevice>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    type: {
      type: String,
      required: [true, "Device type is required"],
      enum: {
        values: ["tag", "phone", "wallet", "pet", "key"],
        message: "{VALUE} is not a valid device type",
      },
    },
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "idle", "offline", "low_battery"],
        message: "{VALUE} is not a valid device status",
      },
      default: "active",
    },
    batteryLevel: {
      type: Number,
      min: [0, "Battery level cannot be below 0"],
      max: [100, "Battery level cannot exceed 100"],
      default: 100,
    },
    signalStrength: {
      type: Number,
      min: [0, "Signal strength cannot be below 0"],
      max: [100, "Signal strength cannot exceed 100"],
      default: 100,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    firmwareVersion: {
      type: String,
      default: "1.0.0",
    },
    hardwareVersion: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    deviceModel: {
      type: String,
    },
    temperature: {
      type: Number,
      default: 25,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pairedAt: {
      type: Date,
      default: Date.now,
    },
    lastIpAddress: {
      type: String,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String, trim: true },
      accuracy: { type: Number, min: 0 },
      altitude: { type: Number },
      speed: { type: Number, min: 0 },
      heading: { type: Number, min: 0, max: 360 },
    },
    settings: {
      notifyOnLeftBehind: { type: Boolean, default: true },
      notifyOnLowBattery: { type: Boolean, default: true },
      notifyOnDisconnect: { type: Boolean, default: true },
      geofenceRadius: { type: Number, default: 100, min: 10, max: 10000 },
      trackingInterval: { type: Number, default: 60, min: 5, max: 3600 },
      precisionFindingEnabled: { type: Boolean, default: true },
      ledIndicator: { type: Boolean, default: true },
    },
    metadata: {
      type: Schema.Types.Mixed,
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

trackingDeviceSchema.index({ user: 1, status: 1 });
trackingDeviceSchema.index({ user: 1, type: 1 });
trackingDeviceSchema.index({ serialNumber: 1 });
trackingDeviceSchema.index({ status: 1, batteryLevel: 1 });
trackingDeviceSchema.index({ "location.lat": 1, "location.lng": 1 });

export const TrackingDevice = mongoose.model<ITrackingDevice>(
  "TrackingDevice",
  trackingDeviceSchema
);
