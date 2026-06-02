import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as alertService from "../services/alert.service.js";

export const listAlerts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, severity, unresolvedOnly } = req.query;
  const result = await alertService.listAlerts(req.user!.userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    severity: severity ? String(severity) : undefined,
    unresolvedOnly: unresolvedOnly === "true",
  });
  res.json(ApiResponse.ok(result));
});

export const resolveAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
  const alert = await alertService.resolveAlert(req.user!.userId, String(req.params.id));
  res.json(ApiResponse.ok({ alert }, "Alert resolved"));
});
