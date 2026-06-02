export type AlertSeverity = "info" | "warning" | "critical";

export interface PrivacyAlert {
  _id: string;
  user: string;
  device?: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  actionLabel?: string;
  resolved: boolean;
  resolvedAt?: string;
  timestamp: string;
}
