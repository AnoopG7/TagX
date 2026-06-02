import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string> = {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "ValidationError" && err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );
  } else if (err.name === "CastError" && err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.message?.includes("E11000") || (err as unknown as Record<string, unknown>).code === 11000) {
    statusCode = 409;
    message = "Duplicate entry. This value already exists.";
    const keyValue = (err as unknown as Record<string, unknown>).keyValue as Record<string, string> | undefined;
    if (keyValue) {
      errors = Object.fromEntries(
        Object.entries(keyValue).map(([key]) => [key, `${key} already exists`])
      );
    }
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or malformed token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  } else if (err.name === "SyntaxError" && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

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
