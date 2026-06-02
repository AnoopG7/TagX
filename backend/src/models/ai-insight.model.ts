import mongoose, { Schema, type Document, type Types } from "mongoose";

export type InsightType = "insight" | "prediction" | "alert" | "suggestion";
export type InsightCategory = "usage" | "battery" | "location" | "security" | "general";
export type InsightFeedback = "helpful" | "not_helpful";

export interface IAIInsight extends Document {
  user: Types.ObjectId;
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  confidence?: number;
  actionable: boolean;
  dismissed: boolean;
  appliedAt?: Date;
  feedback?: InsightFeedback;
  modelName: string;
  metadata: Record<string, unknown>;
  expiresAt?: Date;
  timestamp: Date;
}

const aiInsightSchema = new Schema<IAIInsight>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Insight type is required"],
      enum: {
        values: ["insight", "prediction", "alert", "suggestion"],
        message: "{VALUE} is not a valid insight type",
      },
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["usage", "battery", "location", "security", "general"],
        message: "{VALUE} is not a valid insight category",
      },
      default: "general",
    },
    title: {
      type: String,
      required: [true, "Insight title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Insight description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    confidence: {
      type: Number,
      min: [0, "Confidence cannot be below 0"],
      max: [1, "Confidence cannot exceed 1"],
    },
    actionable: {
      type: Boolean,
      default: false,
    },
    dismissed: {
      type: Boolean,
      default: false,
    },
    appliedAt: {
      type: Date,
    },
    feedback: {
      type: String,
      enum: {
        values: ["helpful", "not_helpful"],
        message: "{VALUE} is not a valid feedback value",
      },
    },
    modelName: {
      type: String,
      required: true,
      default: "groq/llama-3.3-70b",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
    },
    timestamp: {
      type: Date,
      default: Date.now,
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

aiInsightSchema.index({ user: 1, timestamp: -1 });
aiInsightSchema.index({ user: 1, type: 1, timestamp: -1 });
aiInsightSchema.index({ user: 1, category: 1, timestamp: -1 });
aiInsightSchema.index({ user: 1, dismissed: 1 });
aiInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AIInsight = mongoose.model<IAIInsight>(
  "AIInsight",
  aiInsightSchema
);
