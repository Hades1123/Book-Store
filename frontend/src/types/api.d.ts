export enum ErrorCode {
  // Auth errors
  AUTH_EMAIL_EXISTS = 'AUTH_EMAIL_EXISTS',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_INVALID_OTP = 'AUTH_INVALID_OTP',
  AUTH_OTP_EXPIRED = 'AUTH_OTP_EXPIRED',
  AUTH_OTP_ACTIVE = 'AUTH_OTP_ACTIVE',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_REFRESH_TOKEN_INVALID = 'AUTH_REFRESH_TOKEN_INVALID',

  // User errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // Common errors
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

export interface ApiError {
  success: boolean;
  error: {
    code: ErrorCode;
    message: string;
  };
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
