import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

/**
 * Global error handling middleware.
 * Catches all errors (ApiError + unhandled) and returns a structured JSON response.
 */
export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default to 500
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string> = {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = "Validation Error";
  } else if (err.name === "CastError") {
    // Mongoose bad ObjectId
    statusCode = 400;
    message = "Invalid ID format";
  } else if ((err as NodeJS.ErrnoException).code === "11000") {
    // Mongoose duplicate key
    statusCode = 409;
    message = "Duplicate entry";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log in development
  if (env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
