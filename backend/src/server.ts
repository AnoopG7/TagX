import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

// ---- Security ----
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining"],
  })
);

// ---- Compression ----
app.use(compression());

// ---- Global Rate Limiting ----
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ---- Auth-specific stricter rate limiting ----
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

// ---- Body Parsing ----
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// ---- Logging ----
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ---- API Routes ----
app.use("/api/v1", routes);

// ---- Root Route ----
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to TagX API 🏷️",
    version: "1.0.0",
    docs: "/api/v1/health",
  });
});

// ---- 404 Handler ----
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---- Global Error Handler ----
app.use(errorMiddleware);

// ---- Start Server ----
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`\n🏷️  TagX API Server`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Port: ${env.PORT}`);
      console.log(`   URL: http://localhost:${env.PORT}`);
      console.log(`   Health: http://localhost:${env.PORT}/api/v1/health\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n   ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        const mongoose = await import("mongoose");
        await mongoose.default.disconnect();
        console.log("   Server closed. Goodbye.\n");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("   Forced shutdown after 10s timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
