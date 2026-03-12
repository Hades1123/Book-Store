import * as bcrypt from 'bcrypt';

// 2 minutes
export const OTP_EXPIRED_TIME = 60 * 2 * 1000;
const SALTS_ROUND = 10;

// Hash password func
export const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, SALTS_ROUND);
};

export const comparePassword = async (hashedPass: string, inputPass: string) => {
  return await bcrypt.compare(inputPass, hashedPass);
};

// Generate Otp with 6 digit
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
