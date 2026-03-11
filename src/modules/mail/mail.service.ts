import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { type ExternalConfig, externalConfig } from 'src/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  constructor(@Inject(externalConfig.KEY) private readonly externalConfig: ExternalConfig) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.externalConfig.gmailUserName,
        pass: this.externalConfig.gmailAppPass,
      },
    });
  }
  async sendVerificationOtp(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: '"Email system"',
        to: email,
        subject: 'OTP - Verification',
        text: otp,
      });
    } catch (error: any) {
      throw new InternalServerErrorException({ message: 'Mail system crash' });
    }
  }
}
