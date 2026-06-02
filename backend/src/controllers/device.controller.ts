import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as deviceService from "../services/device.service.js";

export const createDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, type, serialNumber, status, firmwareVersion } = req.body;
  const device = await deviceService.createDevice(req.user!.userId, {
    name,
    type,
    serialNumber,
    status,
    firmwareVersion,
  });

  res.status(201).json(ApiResponse.created({ device }, "Device added successfully"));
});

export const listDevices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const devices = await deviceService.listDevices(req.user!.userId);
  res.json(ApiResponse.ok({ devices }));
});

export const getDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const device = await deviceService.getDeviceById(req.user!.userId, String(req.params.id));
  res.json(ApiResponse.ok({ device }));
});

export const updateDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const device = await deviceService.updateDevice(req.user!.userId, String(req.params.id), req.body);
  res.json(ApiResponse.ok({ device }, "Device updated successfully"));
});

export const removeDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deviceService.removeDevice(req.user!.userId, String(req.params.id));
  res.json(ApiResponse.ok(null, "Device removed successfully"));
});

export const updateLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { lat, lng, address, accuracy } = req.body;
  const device = await deviceService.updateDeviceLocation(
    req.user!.userId,
    String(req.params.id),
    { lat, lng, address, accuracy }
  );
  res.json(ApiResponse.ok({ device }, "Location updated"));
});

export const getDeviceEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, type } = req.query;
  const result = await deviceService.getDeviceEvents(req.user!.userId, String(req.params.id), {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    type: type ? String(type) : undefined,
  });
  res.json(ApiResponse.ok(result));
});

export const getDeviceHealth = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit } = req.query;
  const result = await deviceService.getDeviceHealth(req.user!.userId, String(req.params.id), {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(ApiResponse.ok(result));
});
