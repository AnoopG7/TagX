import { body } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { validateRequest } from "../middlewares/validate.middleware.js";

export const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password")
    .custom((val, { req }) => val === req.body.password)
    .withMessage("Passwords do not match"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const forgotPasswordRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const resetPasswordRules = [
  body("token")
    .trim()
    .notEmpty().withMessage("Reset token is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password")
    .custom((val, { req }) => val === req.body.password)
    .withMessage("Passwords do not match"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

const authTypes = ["email_verification", "password_reset", "login"] as const;

export const sendOtpRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("purpose")
    .trim()
    .notEmpty().withMessage("Purpose is required")
    .isIn(authTypes).withMessage(`Purpose must be: ${authTypes.join(", ")}`),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const verifyOtpRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must be numeric"),

  body("purpose")
    .trim()
    .notEmpty().withMessage("Purpose is required")
    .isIn(authTypes).withMessage(`Purpose must be: ${authTypes.join(", ")}`),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];

export const changePasswordRules = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number")
    .custom((val, { req }) => val !== req.body.currentPassword)
    .withMessage("New password must differ from current password"),

  validateRequest as unknown as (req: Request, res: Response, next: NextFunction) => void,
];
