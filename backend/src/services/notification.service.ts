import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

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
