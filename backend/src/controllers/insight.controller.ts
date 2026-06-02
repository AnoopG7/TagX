import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as insightService from "../services/insight.service.js";
import type { InsightCategory, InsightFeedback, InsightType } from "../models/ai-insight.model.js";

export const listInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, type, category, includeDismissed } = req.query;
  const result = await insightService.listInsights(req.user!.userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    type: type ? String(type) : undefined,
    category: category ? String(category) as InsightCategory : undefined,
    includeDismissed: includeDismissed === "true",
  });
  res.json(ApiResponse.ok(result));
});

export const createInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, category, title, description, confidence, actionable, metadata } = req.body;
  const insight = await insightService.createInsight(req.user!.userId, {
    type: type as InsightType,
    category: category as InsightCategory,
    title, description, confidence, actionable, metadata,
  });
  res.status(201).json(ApiResponse.ok({ insight }, "Insight created"));
});

export const dismissInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
  const insight = await insightService.dismissInsight(req.user!.userId, String(req.params.id));
  res.json(ApiResponse.ok({ insight }));
});

export const submitFeedback = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { feedback } = req.body;
  const insight = await insightService.submitInsightFeedback(
    req.user!.userId,
    String(req.params.id),
    feedback as InsightFeedback
  );
  res.json(ApiResponse.ok({ insight }, "Feedback submitted"));
});
