import type {
  LoginResponse,
  RegisterResponse,
  ReqLogin,
  ReqRegister,
  ReqResendOtp,
  ReqVerifyEmail,
} from '@/types/auth';
import axios from './axios.customize';
import type { ApiResponse } from '@/types/api';

export const postRegister = (req: ReqRegister) => {
  return axios.post<ApiResponse<RegisterResponse>>('/auth/register', req);
};

export const postVerifyEmail = (req: ReqVerifyEmail) => {
  return axios.post<ApiResponse<any>>('/auth/verify-email', req);
};

export const postResendOtp = (req: ReqResendOtp) => {
  return axios.post<ApiResponse<RegisterResponse>>('/auth/resend-otp', req);
};

export const postLogin = (req: ReqLogin) => {
  return axios.post<ApiResponse<LoginResponse>>('/auth/login', req);
};

export const postLogout = () => {
  return axios.post<ApiResponse<LoginResponse>>('/auth/logout');
};
