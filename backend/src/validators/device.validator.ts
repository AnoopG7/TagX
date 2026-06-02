import { body, param } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { validateRequest } from "../middlewares/validate.middleware.js";

const deviceTypes = ["tag", "phone", "wallet", "pet", "key"] as const;
const deviceStatuses = ["active", "idle", "offline", "low_battery"] as const;

export const createDeviceRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Device name is required")
    .isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),

  body("type")
    .trim()
    .notEmpty().withMessage("Device type is required")
    .isIn(deviceTypes).withMessage(`Type must be: ${deviceTypes.join(", ")}`),

  body("serialNumber")
    .trim()
    .notEmpty().withMessage("Serial number is required")
    .isAlphanumeric().withMessage("Serial number must be alphanumeric")
    .isLength({ min: 6, max: 30 }).withMessage("Serial number must be 6-30 characters"),

  body("status")
    .optional()
    .trim()
    .isIn(deviceStatuses).withMessage(`Status must be: ${deviceStatuses.join(", ")}`),

  body("firmwareVersion")
    .optional()
    .trim(),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const updateDeviceRules = [
  param("id")
    .trim()
    .notEmpty().withMessage("Device ID is required")
    .isMongoId().withMessage("Invalid device ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),

  body("type")
    .optional()
    .trim()
    .isIn(deviceTypes).withMessage(`Type must be: ${deviceTypes.join(", ")}`),

  body("status")
    .optional()
    .trim()
    .isIn(deviceStatuses).withMessage(`Status must be: ${deviceStatuses.join(", ")}`),

  body("batteryLevel")
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage("Battery level must be 0-100"),

  body("signalStrength")
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage("Signal strength must be 0-100"),

  body("firmwareVersion")
    .optional()
    .trim(),

  body("temperature")
    .optional()
    .isFloat().withMessage("Temperature must be a number"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const updateLocationRules = [
  param("id")
    .trim()
    .notEmpty().withMessage("Device ID is required")
    .isMongoId().withMessage("Invalid device ID"),

  body("lat")
    .notEmpty().withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 }).withMessage("Latitude must be -90 to 90"),

  body("lng")
    .notEmpty().withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be -180 to 180"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Address cannot exceed 200 characters"),

  body("accuracy")
    .optional()
    .isFloat({ min: 0 }).withMessage("Accuracy must be a positive number"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const deviceIdRules = [
  param("id")
    .trim()
    .notEmpty().withMessage("Device ID is required")
    .isMongoId().withMessage("Invalid device ID"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];
