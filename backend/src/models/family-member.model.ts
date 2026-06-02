import mongoose, { Schema, type Document, type Types } from "mongoose";

export type FamilyStatus = "active" | "idle" | "offline" | "low_battery";
export type FamilyPermission =
  | "track_location"
  | "view_devices"
  | "receive_alerts"
  | "manage_members"
  | "view_insights";

export interface IFamilyMember extends Document {
  owner: Types.ObjectId;
  user?: Types.ObjectId;
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
  invitedAt?: Date;
  joinedAt?: Date;
}

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    devices: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "idle", "offline", "low_battery"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    location: {
      type: String,
      trim: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    permissions: [
      {
        type: String,
        enum: {
          values: [
            "track_location",
            "view_devices",
            "receive_alerts",
            "manage_members",
            "view_insights",
          ],
        },
      },
    ],
    invitedAt: {
      type: Date,
    },
    joinedAt: {
      type: Date,
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

familyMemberSchema.index({ owner: 1, name: 1 });
familyMemberSchema.index({ user: 1 });

export const FamilyMember = mongoose.model<IFamilyMember>(
  "FamilyMember",
  familyMemberSchema
);
