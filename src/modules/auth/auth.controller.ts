import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LoginResponse, RegisterResponse } from './interfaces';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { type Request } from 'express';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('Create new user successfully !!!')
  async registerUser(@Body() body: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(body);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto): Promise<RegisterResponse> {
    return this.authService.resendOTP(body);
  }

  @Post('verify-email')
  @ResponseMessage('Verify successfully')
  async verifyEmail(@Body() body: VerifyEmailDto): Promise<void> {
    return this.authService.verifyEmail(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  async getNewToken(@Body() body: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.getNewToken(body);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<void> {
    return this.authService.logout(req);
  }
}
