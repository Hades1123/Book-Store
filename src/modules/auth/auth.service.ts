import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { generateOtp, hashPassword, OTP_EXPIRED_TIME } from './utils/helper';
import { MailService } from 'src/modules/mail/mail.service';
import { RegisterResponse } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}
  async register(body: RegisterDto): Promise<RegisterResponse> {
    const { email, fullName, password, phone } = body;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw AppException.emailExist();
    }

    const hashedPassword = await hashPassword(password);

    await this.prismaService.user.create({
      data: {
        avatarUrl: '',
        email: email,
        fullName: fullName,
        phone: phone,
        role: 'CUSTOMER',
        isActive: false,
        password: hashedPassword,
      },
    });

    const otp = generateOtp();

    await this.prismaService.verificationToken.create({
      data: {
        email: email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + OTP_EXPIRED_TIME),
      },
    });

    await this.mailService.sendVerificationOtp(email, otp);
    return {
      email: email,
      otpExpireTime: OTP_EXPIRED_TIME,
    };
  }
}
