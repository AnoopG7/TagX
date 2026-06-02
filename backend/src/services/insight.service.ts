import { AIInsight } from "../models/ai-insight.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { InsightCategory, InsightFeedback } from "../models/ai-insight.model.js";

export async function listInsights(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    type?: string;
    category?: InsightCategory;
    includeDismissed?: boolean;
  }
) {
  const { page = 1, limit = 20, type, category, includeDismissed } = options;
  const filter: Record<string, unknown> = { user: userId };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (!includeDismissed) filter.dismissed = false;

  const skip = (page - 1) * limit;

  const [insights, total] = await Promise.all([
    AIInsight.find(filter)
      .sort("-timestamp")
      .skip(skip)
      .limit(limit)
      .lean(),
    AIInsight.countDocuments(filter),
  ]);

  return {
    insights,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function dismissInsight(userId: string, insightId: string) {
  const insight = await AIInsight.findOneAndUpdate(
    { _id: insightId, user: userId },
    { $set: { dismissed: true } },
    { new: true }
  );
  if (!insight) {
    throw ApiError.notFound("Insight not found");
  }
  return insight;
}

export async function submitInsightFeedback(
  userId: string,
  insightId: string,
  feedback: InsightFeedback
) {
  const insight = await AIInsight.findOneAndUpdate(
    { _id: insightId, user: userId },
    { $set: { feedback, appliedAt: new Date() } },
    { new: true }
  );
  if (!insight) {
    throw ApiError.notFound("Insight not found");
  }
  return insight;
}
