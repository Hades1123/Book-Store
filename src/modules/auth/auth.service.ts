import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { EXPIRED_TIME, generateOtp, hashPassword } from './utils/helper';
import { externalConfig, type ExternalConfig } from 'src/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(externalConfig.KEY) private readonly externalConfig: ExternalConfig,
  ) {}
  async register(body: RegisterDto) {
    const { email, fullName, password, phone } = body;
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw AppException.emailExist();
    }
    const hassPass = await hashPassword(password);
    const newUser = await this.prismaService.user.create({
      data: {
        avatarUrl: '',
        email: email,
        fullName: fullName,
        phone: phone,
        role: 'CUSTOMER',
        isActive: false,
        password: hassPass,
      },
    });
    const otp = generateOtp();
    await this.prismaService.verificationToken.create({
      data: {
        email: email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + EXPIRED_TIME),
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.externalConfig.gmailUserName,
        pass: this.externalConfig.gmailAppPass,
      },
    });

    (async () => {
      await transporter.sendMail({
        from: '"Email system"',
        to: email,
        subject: 'OTP - Verification',
        text: otp,
      });
    })();
  }
}
