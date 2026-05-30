import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/index.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * JWT authentication middleware.
 * Extracts Bearer token from Authorization header,
 * verifies it, and attaches user info to req.user.
 */
export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token required");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized("Invalid or expired token"));
    }
  }
};
