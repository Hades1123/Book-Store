import * as bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'crypto';
import { SALTS_ROUND } from 'src/modules/auth/constants/common.contants';

// Hash password func
export const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, SALTS_ROUND);
};

export const comparePassword = async (hashedPass: string, inputPass: string) => {
  return await bcrypt.compare(inputPass, hashedPass);
};

// Sha hashing
export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};

export const compareToken = (hashedToken: string, token: string) => {
  const inCommingHash = hashToken(token);
  return timingSafeEqual(Buffer.from(hashedToken), Buffer.from(inCommingHash));
};

// Generate Otp with 6 digit
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
