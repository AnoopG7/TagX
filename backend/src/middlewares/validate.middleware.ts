import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validation middleware.
 * Checks express-validator results and throws ApiError on failure.
 * Use after validation chain in route definitions.
 */
export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {};
    errors.array().forEach((err) => {
      if ("path" in err) {
        formattedErrors[err.path] = err.msg;
      }
    });

    throw ApiError.badRequest("Validation failed", formattedErrors);
  }

  next();
};
