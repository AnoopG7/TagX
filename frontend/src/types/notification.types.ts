export type NotificationType = "location" | "security" | "insight" | "reminder" | "system";
export type NotificationPriority = "low" | "normal" | "high" | "critical";

export interface AppNotification {
  _id: string;
  user: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  read: boolean;
  readAt?: string;
  actionable: boolean;
  actionLabel?: string;
  actionUrl?: string;
  category?: string;
  timestamp: string;
}
