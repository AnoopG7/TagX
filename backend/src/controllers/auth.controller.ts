import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";
import { env } from "../config/env.js";

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);

  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);

  res.status(201).json(
    ApiResponse.created(
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      "Account created successfully"
    )
  );
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);

  res.json(
    ApiResponse.ok(
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      "Logged in successfully"
    )
  );
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incomingToken =
    req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;

  const result = await authService.refreshUserTokens(incomingToken);

  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);

  res.json(ApiResponse.ok(result, "Tokens refreshed"));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.userId) {
    await authService.logoutUser(req.user.userId);
  }

  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });

  res.json(ApiResponse.ok(null, "Logged out successfully"));
});

export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const resetToken = await authService.forgotPassword(email);

  res.json(
    ApiResponse.ok(
      { resetToken },
      resetToken
        ? "Password reset link sent to email"
        : "If an account exists, a reset link has been sent"
    )
  );
});

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);

  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });

  res.json(ApiResponse.ok(null, "Password reset successfully"));
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.userId, currentPassword, newPassword);

  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });

  res.json(ApiResponse.ok(null, "Password changed successfully"));
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  res.json(ApiResponse.ok({ user }));
});

export const sendOtp = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, purpose } = req.body;
  const otp = await authService.sendOtp(email, purpose);

  res.json(
    ApiResponse.ok(
      { otp: env.NODE_ENV === "development" ? otp : undefined },
      "OTP sent successfully"
    )
  );
});

export const verifyOtp = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, otp, purpose } = req.body;
  await authService.verifyOtp(email, otp, purpose);

  res.json(ApiResponse.ok(null, "OTP verified successfully"));
});
