export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  //   message?: string;
}

export interface ApiError {
  success: boolean;
  error: {
    code: string;
    message: string;
  };
}
