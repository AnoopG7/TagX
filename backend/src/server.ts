import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

// ---- Create Express App ----
const app = express();

// ---- Security ----
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---- Rate Limiting ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ---- Body Parsing ----
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ---- Logging ----
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
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
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---- Global Error Handler ----
app.use(errorMiddleware);

// ---- Start Server ----
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`\n🏷️  TagX API Server`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Port: ${env.PORT}`);
      console.log(`   URL: http://localhost:${env.PORT}`);
      console.log(`   Health: http://localhost:${env.PORT}/api/v1/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
