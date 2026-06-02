import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as notificationService from "../services/notification.service.js";

export const listNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, unreadOnly, type } = req.query;
  const result = await notificationService.listNotifications(req.user!.userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    unreadOnly: unreadOnly === "true",
    type: type ? String(type) : undefined,
  });
  res.json(ApiResponse.ok(result));
});

export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await notificationService.markNotificationRead(
    req.user!.userId,
    String(req.params.id)
  );
  res.json(ApiResponse.ok({ notification }));
});

export const markAllRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await notificationService.markAllNotificationsRead(req.user!.userId);
  res.json(ApiResponse.ok(result));
});
