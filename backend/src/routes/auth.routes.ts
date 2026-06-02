import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  sendOtpRules,
  verifyOtpRules,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerRules, authController.register);
router.post("/login", loginRules, authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.post("/forgot-password", forgotPasswordRules, authController.forgotPassword);
router.post("/reset-password", resetPasswordRules, authController.resetPassword);
router.post("/change-password", authMiddleware, changePasswordRules, authController.changePassword);
router.post("/send-otp", sendOtpRules, authController.sendOtp);
router.post("/verify-otp", verifyOtpRules, authController.verifyOtp);
router.get("/me", authMiddleware, authController.getMe);

export default router;
