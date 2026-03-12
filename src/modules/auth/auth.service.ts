import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { generateOtp, hashPassword, OTP_EXPIRED_TIME } from './utils/helper';
import { MailService } from 'src/modules/mail/mail.service';
import { RegisterResponse } from './interfaces';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';

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
    const otp = generateOtp();

    await this.prismaService.$transaction([
      this.prismaService.user.create({
        data: {
          avatarUrl: '',
          email: email,
          fullName: fullName,
          phone: phone,
          role: 'CUSTOMER',
          isActive: false,
          password: hashedPassword,
        },
      }),
      this.prismaService.verificationToken.create({
        data: {
          email: email,
          token: otp,
          type: 'EMAIL_VERIFICATION',
          expiresAt: new Date(Date.now() + OTP_EXPIRED_TIME),
        },
      }),
    ]);

    await this.mailService.sendVerificationOtp(email, otp);

    return {
      email: email,
      otpExpireTime: OTP_EXPIRED_TIME,
    };
  }

  async resendOTP(body: ResendOtpDto): Promise<RegisterResponse> {
    const { email, otpType } = body;

    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw AppException.userNotFound();
    }

    const existingOTP = await this.prismaService.verificationToken.findFirst({
      where: { email: email, type: otpType },
    });

    if (existingOTP && existingOTP.expiresAt > new Date(Date.now())) {
      throw AppException.activeOtp();
    }

    const otp = generateOtp();

    await this.prismaService.$transaction([
      this.prismaService.verificationToken.deleteMany({
        where: { email, type: otpType },
      }),
      this.prismaService.verificationToken.create({
        data: { email: email, token: otp, type: otpType, expiresAt: new Date(Date.now() + OTP_EXPIRED_TIME) },
      }),
    ]);

    await this.mailService.sendVerificationOtp(email, otp);

    return {
      email: email,
      otpExpireTime: OTP_EXPIRED_TIME,
    };
  }

  async verifyEmail(body: VerifyEmailDto): Promise<void> {
    const { email, otp, otpType } = body;
    const existingOtp = await this.prismaService.verificationToken.findFirst({
      where: { email, token: otp, type: otpType },
    });

    if (!existingOtp || existingOtp.expiresAt < new Date(Date.now())) {
      throw AppException.invalidOtp();
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { email },
        data: { isActive: true },
      }),
      this.prismaService.verificationToken.delete({
        where: { id: existingOtp.id },
      }),
    ]);
  }

  async login(body: LoginDto): Promise<any> {}
}
