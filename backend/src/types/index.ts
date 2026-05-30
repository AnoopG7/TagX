import type { Request } from "express";

/**
 * Extended Express Request with authenticated user data.
 * Used after the auth middleware attaches user info.
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
