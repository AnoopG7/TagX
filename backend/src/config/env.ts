import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: Missing env variable ${envVar}`);
  }
}

const parseOrigins = (val: string | undefined): (string | RegExp)[] => {
  if (!val) return ["http://localhost:5173"];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith("/") && s.endsWith("/")) {
        return new RegExp(s.slice(1, -1));
      }
      return s;
    });
};

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/tagx",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret-change-me",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret-change-me",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "15m",
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "7d",

  // CORS — comma-separated origins, supports /regex/
  CORS_ORIGINS: parseOrigins(process.env.CORS_ORIGINS || process.env.CLIENT_URL),

  // Groq AI
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
} as const;

export type Env = typeof env;
