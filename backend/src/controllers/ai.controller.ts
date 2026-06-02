import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as groqService from "../services/groq.service.js";
import * as insightService from "../services/insight.service.js";
import * as alertService from "../services/alert.service.js";
import * as notificationService from "../services/notification.service.js";

export const generateLeavePrediction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { deviceName } = req.body;
  const description = await groqService.leavePrediction(deviceName ?? "your device");

  const insight = await insightService.createInsight(req.user!.userId, {
    type: "prediction",
    category: "usage",
    title: "Leaving reminder",
    description,
    confidence: 0.85,
    actionable: true,
  });

  await notificationService.createNotification(req.user!.userId, {
    type: "reminder",
    priority: "high",
    title: "Don't forget!",
    description: `${deviceName ?? "Your device"} hasn't moved — check if you have it.`,
    actionable: true,
  });

  res.status(201).json(ApiResponse.ok({ insight }));
});

export const generateLocationInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { lat, lng } = req.body;
  const description = await groqService.placeDescription(Number(lat), Number(lng));

  const insight = await insightService.createInsight(req.user!.userId, {
    type: "insight",
    category: "location",
    title: "Location insight",
    description,
    confidence: 0.7,
    actionable: false,
    metadata: { lat: Number(lat), lng: Number(lng) },
  });

  res.status(201).json(ApiResponse.ok({ insight }));
});

export const generateSessionSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { totalPoints, distanceM, durationMs, lat, lng } = req.body;
  const description = await groqService.sessionSummary(
    Number(totalPoints), Number(distanceM), Number(durationMs), Number(lat), Number(lng)
  );

  const insight = await insightService.createInsight(req.user!.userId, {
    type: "insight",
    category: "usage",
    title: "Session summary",
    description,
    confidence: 0.9,
    actionable: false,
  });

  res.status(201).json(ApiResponse.ok({ insight }));
});

export const reportLostDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { deviceName, lat, lng, deviceId } = req.body;

  const [suggestionText, anomalyText] = await Promise.all([
    groqService.searchSuggestion(Number(lat), Number(lng), 0),
    groqService.anomalyDescription(deviceName ?? "Device", Number(lat), Number(lng)),
  ]);

  const [alert, insight, notification] = await Promise.all([
    alertService.createAlert(req.user!.userId, {
      severity: "critical",
      title: `${deviceName ?? "Device"} reported lost`,
      description: anomalyText,
      location: lat && lng ? `Near (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})` : "Unknown",
      coordinates: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
      metadata: { deviceId, simulated: true, lostAt: new Date().toISOString() },
    }),
    insightService.createInsight(req.user!.userId, {
      type: "suggestion",
      category: "security",
      title: "Search suggestion",
      description: suggestionText,
      confidence: 0.6,
      actionable: true,
      metadata: { deviceId, simulated: true, lostAt: new Date().toISOString() },
    }),
    notificationService.createNotification(req.user!.userId, {
      type: "security",
      priority: "critical",
      title: "Device Lost",
      description: `${deviceName ?? "A device"} has been marked as lost. AI search assistance is available.`,
      actionable: true,
    }),
  ]);

  res.status(201).json(ApiResponse.ok({ alert, insight, notification }));
});
