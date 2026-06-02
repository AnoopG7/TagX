import crypto from "node:crypto";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import type { IUser } from "../models/user.model.js";

function sanitizeUser(user: IUser) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isVerified: user.isVerified,
    preferences: user.preferences,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account has been deactivated");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw ApiError.tooManyRequests(
      "Account locked. Try again in 15 minutes."
    );
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function refreshUserTokens(incomingRefreshToken: string) {
  if (!incomingRefreshToken) {
    throw ApiError.unauthorized("Refresh token required");
  }

  let decoded: { userId: string; role: string };
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("User not found or deactivated");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized("Refresh token mismatch — possible theft");
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(userId: string) {
  const user = await User.findById(userId).select("+refreshToken");
  if (!user) return;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return resetToken;
}

export async function resetPassword(token: string, password: string) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw ApiError.badRequest("Invalid or expired reset token");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return sanitizeUser(user);
}

export async function sendOtp(
  email: string,
  purpose: "email_verification" | "password_reset" | "login"
) {
  const user = await User.findOne({ email });
  if (purpose === "email_verification" && user?.isVerified) {
    throw ApiError.conflict("Email is already verified");
  }
  if (purpose === "login" && !user) {
    throw ApiError.notFound("No account found with this email");
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");

  await OTP.deleteMany({ email, purpose });

  await OTP.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    metadata: {},
  });

  return otpCode;
}

export async function verifyOtp(
  email: string,
  otpCode: string,
  purpose: "email_verification" | "password_reset" | "login"
) {
  const otpRecord = await OTP.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (!otpRecord) {
    throw ApiError.badRequest("No OTP found. Request a new one.");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw ApiError.badRequest("OTP has expired. Request a new one.");
  }

  if (otpRecord.attempts >= 5) {
    throw ApiError.tooManyRequests("Too many failed attempts. Request a new OTP.");
  }

  const hashedInput = crypto.createHash("sha256").update(otpCode).digest("hex");
  if (otpRecord.otp !== hashedInput) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest("Invalid OTP");
  }

  await OTP.deleteOne({ _id: otpRecord._id });

  if (purpose === "email_verification") {
    await User.findOneAndUpdate({ email }, { isVerified: true });
  }

  return true;
}
