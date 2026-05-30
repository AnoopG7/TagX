import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// Verify connection on startup (non-blocking)
transporter.verify().then(() => {
  console.log("✅ SMTP server ready");
}).catch((err) => {
  console.warn("⚠️  SMTP not configured:", err.message);
});
