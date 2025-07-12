import { apiRequest } from "./client";
import { Category, Provider, Product } from "@/lib/types";

export const ppobApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    return apiRequest("/products/categories");
  },

  getProvidersByCategory: async (
    categoryId: number
  ): Promise<{ providers: Provider[] }> => {
    return apiRequest(`/products/categories/${categoryId}/providers`);
  },

  getProductsByProvider: async (
    providerId: number,
    categoryId?: number
  ): Promise<{ products: Product[] }> => {
    return apiRequest(`/products/providers/${providerId}/products`, {
      params: categoryId ? { categoryId } : undefined,
    });
  },

  getProductDetail: async (
    productId: number
  ): Promise<{ product: Product }> => {
    return apiRequest(`/products/${productId}`);
  },

  createTransaction: async (data: {
    product_id: number;
    target_number: string;
  }): Promise<{
    message: string;
    transaction: any;
    product: {
      name: string;
      provider: string;
      category: string;
    };
  }> => {
    return apiRequest("/transactions/create", {
      method: "POST",
      data,
    });
  },

  getTransactionDetail: async (
    transactionId: string
  ): Promise<{
    success: boolean;
    transaction: any;
    message: string;
  }> => {
    return apiRequest(`/transactions/${transactionId}`);
  },

  createPayment: async (data: {
    transaction_id: string;
    payment_method: string;
  }): Promise<{
    success: boolean;
    message: string;
    payment_method: string;
    status: string;
    transaction_id: string;
    new_balance?: number;
    processing?: boolean;
  }> => {
    return apiRequest("/payment/create", {
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
    type: string;
    message: string;
  }> => {
    return apiRequest(`/payment/status/${orderId}`);
  },
};
