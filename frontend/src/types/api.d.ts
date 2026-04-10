interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

interface ApiError {
  success: boolean;
  error: {
    code: ErrorCode;
    message: string;
  };
}

interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
