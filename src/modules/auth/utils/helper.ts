import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import externalConfig from 'src/config/external.config';
// 20 seconds
export const EXPIRED_TIME = 20 * 1000;

const SALTS_ROUND = 10;

export const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, SALTS_ROUND);
};

// Generate Otp with 6 digit
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
