import { body, param } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { validateRequest } from "../middlewares/validate.middleware.js";

const familyStatuses = ["active", "idle", "offline", "low_battery"] as const;
const familyPermissions = [
  "track_location",
  "view_devices",
  "receive_alerts",
  "manage_members",
  "view_insights",
] as const;

export const addMemberRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Member name is required")
    .isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim(),

  body("role")
    .trim()
    .notEmpty().withMessage("Role is required"),

  body("relationship")
    .optional()
    .trim(),

  body("status")
    .optional()
    .trim()
    .isIn(familyStatuses).withMessage(`Status must be: ${familyStatuses.join(", ")}`),

  body("permissions")
    .optional()
    .isArray().withMessage("Permissions must be an array"),

  body("permissions.*")
    .optional()
    .isIn(familyPermissions).withMessage(`Permission must be one of: ${familyPermissions.join(", ")}`),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const updateMemberRules = [
  param("id")
    .trim()
    .notEmpty().withMessage("Member ID is required")
    .isMongoId().withMessage("Invalid member ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim(),

  body("role")
    .optional()
    .trim(),

  body("relationship")
    .optional()
    .trim(),

  body("status")
    .optional()
    .trim()
    .isIn(familyStatuses).withMessage(`Status must be: ${familyStatuses.join(", ")}`),

  body("location")
    .optional()
    .trim(),

  body("permissions")
    .optional()
    .isArray().withMessage("Permissions must be an array"),

  body("permissions.*")
    .optional()
    .isIn(familyPermissions).withMessage(`Permission must be one of: ${familyPermissions.join(", ")}`),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const memberIdRules = [
  param("id")
    .trim()
    .notEmpty().withMessage("Member ID is required")
    .isMongoId().withMessage("Invalid member ID"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];
