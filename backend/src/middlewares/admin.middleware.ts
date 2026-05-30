import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/index.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Admin authorization middleware.
 * Must be used AFTER auth middleware.
 * Checks that the authenticated user has the 'admin' role.
 */
export const adminMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  if (req.user.role !== "admin") {
    return next(ApiError.forbidden("Admin access required"));
  }

  next();
};
