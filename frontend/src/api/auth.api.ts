import type {
  LoginResponse,
  RegisterResponse,
  ReqLogin,
  ReqRegister,
  ReqResendOtp,
  ReqVerifyEmail,
} from '@/types/auth';
import axios from './axios.customize';

export const postRegister = async (req: ReqRegister) => {
  const result = await axios.post<ApiResponse<RegisterResponse>>('/auth/register', req);
  return result.data;
};

export const postVerifyEmail = async (req: ReqVerifyEmail) => {
  const result = await axios.post<ApiResponse<any>>('/auth/verify-email', req);
  return result.data;
};

export const postResendOtp = async (req: ReqResendOtp) => {
  const result = await axios.post<ApiResponse<RegisterResponse>>('/auth/resend-otp', req);
  return result.data;
};

export const postLogin = async (req: ReqLogin) => {
  const result = await axios.post<ApiResponse<LoginResponse>>('/auth/login', req);
  return result.data;
};

export const postLogout = async () => {
  const result = await axios.post<ApiResponse<LoginResponse>>('/auth/logout');
  return result.data;
};
