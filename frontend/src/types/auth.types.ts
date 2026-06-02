export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  avatar?: { url: string; publicId: string };
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  preferences: {
    theme: "dark" | "light" | "system";
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    language: string;
    timezone: string;
    privacyScanEnabled: boolean;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
