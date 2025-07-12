// lib/api/auth.ts
import { apiRequest } from "./client";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/lib/types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      data,
    });
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    return apiRequest("/auth/register", {
      method: "POST",
      data,
    });
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return apiRequest("/auth/verify-email", {
      method: "POST",
      data: { token },
    });
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    return apiRequest("/auth/resend-verification", {
      method: "POST",
      data: { email },
    });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      data: { email },
    });
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      data: { token, newPassword },
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
};
