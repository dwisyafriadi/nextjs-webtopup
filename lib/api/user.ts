// lib/api/user.ts
import { apiRequest } from "./client";
import { User, Transaction, ChangePasswordForm } from "@/lib/types";

export const userApi = {
  getProfile: async (): Promise<{ user: User }> => {
    return apiRequest("/user/profile");
  },

  updateProfile: async (
    data: Partial<User>
  ): Promise<{ message: string; user: User }> => {
    return apiRequest("/user/profile", {
      method: "PUT",
      data,
    });
  },

  getBalance: async (): Promise<{ balance: { balance: number } }> => {
    return apiRequest("/user/balance");
  },

  getTransactions: async (
    page = 1,
    limit = 10
  ): Promise<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    return apiRequest("/user/transactions", {
      params: { page, limit },
    });
  },

  changePassword: async (
    data: ChangePasswordForm
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest("/user/change-password", {
      method: "POST",
      data,
    });
  },
};
