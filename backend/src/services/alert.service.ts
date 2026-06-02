import { PrivacyAlert } from "../models/privacy-alert.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { AlertSeverity } from "../models/privacy-alert.model.js";

export async function listAlerts(
  userId: string,
  options: { page?: number; limit?: number; severity?: string; unresolvedOnly?: boolean }
) {
  const { page = 1, limit = 20, severity, unresolvedOnly } = options;
  const filter: Record<string, unknown> = { user: userId };

  if (severity) filter.severity = severity;
  if (unresolvedOnly) filter.resolved = false;

  const skip = (page - 1) * limit;

  const [alerts, total] = await Promise.all([
    PrivacyAlert.find(filter)
      .sort("-timestamp")
      .skip(skip)
      .limit(limit)
      .lean(),
    PrivacyAlert.countDocuments(filter),
  ]);

  return {
    alerts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function createAlert(
  userId: string,
  data: {
    severity: AlertSeverity;
    title: string;
    description: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    device?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const alert = await PrivacyAlert.create({
    user: userId,
    severity: data.severity,
    title: data.title,
    description: data.description,
    location: data.location,
    coordinates: data.coordinates,
    device: data.device,
    metadata: data.metadata ?? {},
  });
  return alert;
}

export async function resolveAlert(userId: string, alertId: string) {
  const alert = await PrivacyAlert.findOneAndUpdate(
    { _id: alertId, user: userId },
    { $set: { resolved: true, resolvedAt: new Date() } },
    { new: true }
  );
  if (!alert) {
    throw ApiError.notFound("Alert not found");
  }
  return alert;
}
