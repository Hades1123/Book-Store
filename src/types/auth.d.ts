export type VerificationType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export interface ReqRegister {
  email: string;
  fullName: string;
  phone: string;
  password: string;
}

export interface ReqResendOtp {
  email: string;
  otpType: VerificationType;
}

export interface ReqVerifyEmail {
  email: string;
  otp: string;
  otpType: VerificationType;
}

export interface ReqLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  email: string;
  otpExpireTime: number; // milisecond
}
