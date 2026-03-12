import { IsEmail, IsEnum, IsString } from 'class-validator';
import { VerificationType } from 'src/generated/prisma/enums';

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsEnum(VerificationType)
  otpType: VerificationType;
}
