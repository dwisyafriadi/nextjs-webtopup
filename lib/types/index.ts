// lib/types/index.ts

// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  referral_code: string;
  balance: number;
  referral_earned?: number;
  topup_earned?: number;
  created_at: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  referral_code?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken?: string;
  user: User;
}

// Product types
export interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface Provider {
  id: number;
  name: string;
  brand_code: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  product_name: string;
  sku_code: string;
  price: number;
  markup_value: number;
  markup_percent: number;
  deskripsi?: string;
  final_price: number;
  provider_name?: string;
  category_name?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  transaction_id: string;
  target_number: string;
  serial_number?: string;
  price: number;
  total_price: number;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed";
  tx_status: "waiting" | "pending" | "processing" | "sukses" | "gagal";
  created_at: string;
  product_name?: string;
  provider_name?: string;
  category_name?: string;
}

// Top-up types
export interface TopUpOption {
  amount: number;
  label: string;
  popular: boolean;
}

export interface PaymentMethod {
  code: string;
  name: string;
  type: "qris" | "bank_transfer" | "e-wallet";
  description: string;
  icon: string;
  fee: number;
  image?: string;
}

export interface TopUpRequest {
  amount: number;
  paymentMethod: string;
}

export interface TopUpResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    totalAmount: number;
    paymentFee: number;
    systemFee: number;
    paymentMethod: string;
    payment: {
      reference: string;
      paymentUrl: string;
      qrString?: string;
      vaNumber?: string;
    };
    expiresAt: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Balance History
export interface BalanceHistory {
  id: number;
  type: "topup" | "purchase" | "refund";
  amount: number;
  description: string;
  reference: string;
  created_at: string;
}

// Form types
export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
