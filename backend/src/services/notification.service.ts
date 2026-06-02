import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { NotificationType, NotificationPriority } from "../models/notification.model.js";

export async function listNotifications(
  userId: string,
  options: { page?: number; limit?: number; unreadOnly?: boolean; type?: string }
) {
  const { page = 1, limit = 20, unreadOnly, type } = options;
  const filter: Record<string, unknown> = { user: userId };

  if (unreadOnly) filter.read = false;
  if (type) filter.type = type;

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort("-timestamp")
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, read: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function createNotification(
  userId: string,
  data: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    description: string;
    actionable?: boolean;
    actionLabel?: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const notification = await Notification.create({
    user: userId,
    type: data.type,
    priority: data.priority,
    title: data.title,
    description: data.description,
    actionable: data.actionable ?? false,
    actionLabel: data.actionLabel,
    actionUrl: data.actionUrl,
    metadata: data.metadata ?? {},
  });
  return notification;
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { read: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }
  return notification;
}

export async function markAllNotificationsRead(userId: string) {
  const result = await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
  return { modifiedCount: result.modifiedCount };
}
