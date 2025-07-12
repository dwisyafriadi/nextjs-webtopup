import { apiRequest } from "./client";
import {
  TopUpOption,
  PaymentMethod,
  TopUpRequest,
  TopUpResponse,
} from "@/lib/types";

export const topupApi = {
  getOptions: async (): Promise<{
    amounts: TopUpOption[];
    paymentMethods: PaymentMethod[];
    minAmount: number;
    maxAmount: number;
  }> => {
    return apiRequest("/topup/options");
  },

  createTopup: async (data: TopUpRequest): Promise<TopUpResponse> => {
    return apiRequest("/topup/create", {
      method: "POST",
      data,
    });
  },

  checkPaymentStatus: async (
    orderId: string
  ): Promise<{
    success: boolean;
    status: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    createdAt: string;
    message: string;
  }> => {
    return apiRequest(`/topup/payment-status/${orderId}`);
  },

  getHistory: async (
    page = 1,
    limit = 10
  ): Promise<{
    success: boolean;
    history: Array<{
      id: number;
      orderId: string;
      amount: number;
      paymentFee: number;
      systemFee: number;
      totalAmount: number;
      paymentMethod: string;
      status: string;
      statusMessage: string;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    return apiRequest("/topup/history", {
      params: { page, limit },
    });
  },
};
