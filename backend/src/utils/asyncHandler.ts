import type { Request, Response, NextFunction } from "express";

/**
 * Wraps async route handlers to catch errors and pass them to the error middleware.
 * Eliminates try-catch boilerplate in every controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
