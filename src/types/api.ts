// API Response and Request Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// User Types
export interface User {
  id: number;
  photo?: string;
  fullname: string;
  email: string;
  phone?: string;
  user_userkyc_user?: Array<{
    kyc_verified: "SUCCESSFUL" | "PENDING" | "FAILED";
  }>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  fullname: string;
  password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

export interface PasswordResetRequest {
  email: string;
  reset_code: string;
  password: string;
}

export interface PasswordResetRequestRequest {
  email: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface ResendOtpRequest {
  user_email: string;
}

// Bank Details Types
export interface BankDetails {
  id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  user: number;
}

export interface CreateBankDetailsRequest {
  account_name: string;
  account_number: string;
  bank_name: string;
}

export interface VerifyAccountRequest {
  bank_code: string;
  account_number: string;
}

export interface VerifyAccountResponse {
  status: string;
  status_code: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}

// Swap Types
export interface CoinSwapRequest {
  coin_name: string;
  coin_amount_to_swap: string;
  network: string;
  phone_number: string;
  bank_acc_name: string;
  bank_acc_number: string;
  bank_code: string;
}

export interface Transaction {
  id: number;
  created_at: string;
  updated_at: string;
  coin_name: string;
  coin_amount_to_swap: string;
  ngn_equivalent: string;
  network: string;
  phone_number: string;
  current_usdt_ngn_rate: string;
  coin_address: string;
  transaction_ref: string;
  transaction_status: "SUCCESS" | "PENDING" | "FAILED";
  payout_status: "SUCCESS" | "PENDING" | "FAILED";
  bank_acc_name: string;
  bank_acc_number: string;
  bank_code: string;
  trans_address?: string;
  trans_chain?: string;
  trans_amount?: string;
  trans_amount_ngn?: string;
  trans_hash?: string;
  bitpowr_ref?: string;
  admin_trans_uid?: string;
  admin_trans_amount?: string;
  admin_trans_fee?: string;
  admin_trans_ref?: string;
  user: number;
}

export interface RateCalculatorRequest {
  coin_name: string;
  coin_amount_to_calc: string;
}

export interface RateCalculatorResponse {
  total_coin_price_ngn: number;
}

export interface SupportRequest {
  message: string;
  subject: string;
}

export interface SwapSortRequest {
  coin_name?: string;
  date?: string;
  trans_status?: string;
  start_date_end_date?: string[];
}

export interface UpdateTransactionRequest {
  transaction_status: "SUCCESS" | "PENDING" | "FAILED";
  payout_status: "SUCCESS" | "PENDING" | "FAILED";
}

export interface UsdRateResponse {
  usdt_ngn_rate: string;
}