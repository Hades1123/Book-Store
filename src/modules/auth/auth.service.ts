import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { comparePassword, compareToken, generateOtp, hashPassword, hashToken, OTP_EXPIRED_TIME } from './utils/helper';
import { MailService } from 'src/modules/mail/mail.service';
import { LoginResponse, RegisterResponse } from './interfaces';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TPayload } from 'src/common/types/payload.type';
import { User } from 'src/generated/prisma/client';
import { type JwtConfig, jwtConfig } from 'src/config';
import { StringValue } from 'ms';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { randomUUID } from 'crypto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfig: JwtConfig,
  ) {}

  private async generateToken(user: User): Promise<LoginResponse> {
    const payload: TPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Use default secret in auth-core module
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.jwtConfig.jwtRefreshSecret,
        expiresIn: this.jwtConfig.jwtRefreshExpire as StringValue,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(body: RegisterDto): Promise<RegisterResponse> {
    const { email, fullName, password, phone } = body;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    const otp = generateOtp();

    if (existingUser && existingUser.emailVerified) {
      throw AppException.emailExist();
    } else if (existingUser && !existingUser.emailVerified) {
      const existingOtp = await this.prismaService.verificationToken.findFirst({
        where: { email, type: 'EMAIL_VERIFICATION' },
      });
      if (existingOtp && existingOtp.expiresAt > new Date(Date.now())) {
        throw AppException.activeOtp();
      }
      const hashedPassword = await hashPassword(password);
      await this.prismaService.$transaction([
        this.prismaService.user.update({
          where: { email: email },
          data: { password: hashedPassword, phone, fullName },
        }),
        this.prismaService.verificationToken.deleteMany({
          where: { email: email, type: 'EMAIL_VERIFICATION' },
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
    } else {
      const hashedPassword = await hashPassword(password);
      await this.prismaService.$transaction([
        this.prismaService.user.create({
          data: {
            avatarPublicId: '',
            email: email,
            fullName: fullName,
            phone: phone,
            role: 'CUSTOMER',
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
    }

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
        data: { emailVerified: true },
      }),
      this.prismaService.verificationToken.delete({
        where: { id: existingOtp.id },
      }),
    ]);
  }

  async login(body: LoginDto): Promise<LoginResponse> {
    const { email, password } = body;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !user.emailVerified) {
      throw AppException.errorLogin();
    }

    const isCorrectPassword = await comparePassword(user?.password!, password);

    if (!isCorrectPassword) {
      throw AppException.errorLogin();
    }

    const { accessToken, refreshToken } = await this.generateToken(user);

    const hashedRefreshToken = hashToken(refreshToken);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashRefreshToken: hashedRefreshToken },
    });

    return { accessToken, refreshToken };
  }

  async getNewToken(refreshToken: string): Promise<LoginResponse> {
    if (!refreshToken) {
      throw AppException.invalidToken();
    }
    try {
      const payload: TPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.jwtRefreshSecret,
      });

      const { sub } = payload;

      const user = await this.prismaService.user.findUnique({ where: { id: sub } });

      if (!user || !user.hashRefreshToken) {
        throw new UnauthorizedException();
      }

      const isTheSameToken = compareToken(user.hashRefreshToken, refreshToken);

      if (!isTheSameToken) {
        throw AppException.invalidToken();
      }
      const newTokens = await this.generateToken(user);

      const hashedRefreshToken = hashToken(newTokens.refreshToken);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { hashRefreshToken: hashedRefreshToken },
      });

      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw AppException.tokenExpired();
      }
      throw AppException.invalidToken();
    }
  }

  async logout(req: Request): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    const { sub } = req.user;
    const user = await this.prismaService.user.findUnique({ where: { id: sub } });
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashRefreshToken: null },
    });
  }
}
