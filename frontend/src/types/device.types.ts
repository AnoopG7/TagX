export type DeviceType = "tag" | "phone" | "wallet" | "pet" | "key";
export type DeviceStatus = "active" | "idle" | "offline" | "low_battery";

export interface DeviceLocation {
  lat: number;
  lng: number;
  address?: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export interface DeviceSettings {
  notifyOnLeftBehind: boolean;
  notifyOnLowBattery: boolean;
  notifyOnDisconnect: boolean;
  geofenceRadius: number;
  trackingInterval: number;
  precisionFindingEnabled: boolean;
  ledIndicator: boolean;
}

export interface TrackingDevice {
  _id: string;
  user: string;
  name: string;
  type: DeviceType;
  serialNumber: string;
  status: DeviceStatus;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  firmwareVersion: string;
  hardwareVersion?: string;
  manufacturer?: string;
  deviceModel?: string;
  temperature: number;
  isActive: boolean;
  pairedAt: string;
  location?: DeviceLocation;
  settings: DeviceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  _id: string;
  device: string;
  type: "location" | "connection" | "alert" | "status";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  icon: "map-pin" | "bluetooth" | "wifi" | "power" | "alert";
  location?: { lat: number; lng: number; address?: string };
  source: "bluetooth" | "gps" | "crowd" | "manual" | "system";
  timestamp: string;
}

export interface DeviceHealth {
  _id: string;
  device: string;
  uptime: number;
  signalStrength: number;
  batteryHealth: number;
  temperature: number;
  memoryUsage?: number;
  connectionErrors?: number;
  firmwareVersion?: string;
  timestamp: string;
}
