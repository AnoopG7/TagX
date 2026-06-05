import mongoose, { Schema, type Document } from "mongoose";

export type ContactStatus = "unread" | "read" | "replied";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
    subject: { type: String, required: [true, "Subject is required"], trim: true },
    message: { type: String, required: [true, "Message is required"], maxlength: 5000 },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
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

contactSchema.index({ status: 1, createdAt: -1 });

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
