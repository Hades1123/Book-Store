import { IsEmail, IsEnum } from 'class-validator';
import { VerificationType } from 'src/generated/prisma/enums';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(VerificationType)
  otpType: VerificationType;
}
