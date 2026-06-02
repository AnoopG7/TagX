import { TrackingDevice } from "../models/tracking-device.model.js";
import { TrackingEvent } from "../models/tracking-event.model.js";
import { DeviceHealth } from "../models/device-health.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { DeviceType, DeviceStatus, IDeviceLocation } from "../models/tracking-device.model.js";

interface CreateDeviceInput {
  name: string;
  type: DeviceType;
  serialNumber: string;
  status?: DeviceStatus;
  firmwareVersion?: string;
}

interface UpdateDeviceInput {
  name?: string;
  type?: DeviceType;
  status?: DeviceStatus;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
  temperature?: number;
}

export async function createDevice(userId: string, input: CreateDeviceInput) {
  const existing = await TrackingDevice.findOne({
    serialNumber: input.serialNumber,
  });
  if (existing) {
    throw ApiError.conflict("A device with this serial number already exists");
  }

  const device = await TrackingDevice.create({
    user: userId,
    ...input,
  });

  await TrackingEvent.create({
    device: device._id,
    type: "status",
    severity: "info",
    title: "Device Paired",
    description: `${input.name} has been added to your network`,
    icon: "bluetooth",
    source: "manual",
    metadata: {},
  });

  return device;
}

export async function listDevices(userId: string) {
  return TrackingDevice.find({ user: userId, isActive: true })
    .sort("-lastSeen")
    .lean();
}

export async function getDeviceById(userId: string, deviceId: string) {
  const device = await TrackingDevice.findOne({
    _id: deviceId,
    user: userId,
  });
  if (!device) {
    throw ApiError.notFound("Device not found");
  }
  return device;
}

export async function updateDevice(
  userId: string,
  deviceId: string,
  input: UpdateDeviceInput
) {
  const device = await TrackingDevice.findOneAndUpdate(
    { _id: deviceId, user: userId },
    { $set: input },
    { new: true, runValidators: true }
  );
  if (!device) {
    throw ApiError.notFound("Device not found");
  }
  return device;
}

export async function removeDevice(userId: string, deviceId: string) {
  const device = await TrackingDevice.findOneAndUpdate(
    { _id: deviceId, user: userId },
    { $set: { isActive: false, status: "offline" as DeviceStatus } },
    { new: true }
  );
  if (!device) {
    throw ApiError.notFound("Device not found");
  }

  await TrackingEvent.create({
    device: device._id,
    type: "status",
    severity: "info",
    title: "Device Removed",
    description: `${device.name} has been removed from your network`,
    icon: "power",
    source: "manual",
    metadata: {},
  });

  return device;
}

export async function updateDeviceLocation(
  userId: string,
  deviceId: string,
  location: IDeviceLocation
) {
  const device = await TrackingDevice.findOneAndUpdate(
    { _id: deviceId, user: userId },
    {
      $set: {
        location,
        lastSeen: new Date(),
      },
    },
    { new: true }
  );
  if (!device) {
    throw ApiError.notFound("Device not found");
  }

  await TrackingEvent.create({
    device: device._id,
    type: "location",
    severity: "info",
    title: "Location Updated",
    description: location.address
      ? `${device.name} spotted at ${location.address}`
      : `${device.name} location updated`,
    icon: "map-pin",
    location,
    source: "bluetooth",
    metadata: {},
  });

  return device;
}

export async function getDeviceEvents(
  userId: string,
  deviceId: string,
  options: { page?: number; limit?: number; type?: string }
) {
  const device = await TrackingDevice.findOne({ _id: deviceId, user: userId });
  if (!device) {
    throw ApiError.notFound("Device not found");
  }

  const { page = 1, limit = 20, type } = options;
  const filter: Record<string, unknown> = { device: deviceId };
  if (type) filter.type = type;

  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    TrackingEvent.find(filter)
      .sort("-timestamp")
      .skip(skip)
      .limit(limit)
      .lean(),
    TrackingEvent.countDocuments(filter),
  ]);

  return {
    events,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getDeviceHealth(
  userId: string,
  deviceId: string,
  options: { page?: number; limit?: number }
) {
  const device = await TrackingDevice.findOne({ _id: deviceId, user: userId });
  if (!device) {
    throw ApiError.notFound("Device not found");
  }

  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    DeviceHealth.find({ device: deviceId })
      .sort("-timestamp")
      .skip(skip)
      .limit(limit)
      .lean(),
    DeviceHealth.countDocuments({ device: deviceId }),
  ]);

  return {
    records,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
