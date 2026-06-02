export type InsightType = "insight" | "prediction" | "alert" | "suggestion";
export type InsightCategory = "usage" | "battery" | "location" | "security" | "general";

export interface AIInsight {
  _id: string;
  user: string;
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  confidence?: number;
  actionable: boolean;
  dismissed: boolean;
  feedback?: "helpful" | "not_helpful";
  modelName: string;
  timestamp: string;
}
