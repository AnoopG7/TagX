export type FamilyStatus = "active" | "idle" | "offline" | "low_battery";
export type FamilyPermission =
  | "track_location" | "view_devices" | "receive_alerts" | "manage_members" | "view_insights";

export interface FamilyMember {
  _id: string;
  owner: string;
  user?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  relationship?: string;
  avatar?: string;
  devices: number;
  status: FamilyStatus;
  location?: string;
  isOwner: boolean;
  permissions: FamilyPermission[];
  createdAt: string;
  updatedAt: string;
}
