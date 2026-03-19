import { Body, Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LoginResponse, RegisterResponse } from './interfaces';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { type JwtConfig, jwtConfig } from 'src/config';
import { COOKIE_NAMES, cookieOptions } from './constants/cookie.constants';
import ms, { StringValue } from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigService: JwtConfig,
  ) {}

  @Post('register')
  @ResponseMessage('We have just sent OTP to your email, check it !!!')
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
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.authService.login(body);
    res.cookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      accessToken,
      cookieOptions(ms(this.jwtConfigService.jwtAccessExpire as StringValue)),
    );
    res.cookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      refreshToken,
      cookieOptions(ms(this.jwtConfigService.jwtRefreshExpire as StringValue)),
    );
    return {
      accessToken: '********',
      refreshToken: '********',
    };
  }

  @Post('refresh-token')
  async getNewToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    const tokens = await this.authService.getNewToken(refreshToken);
    res.cookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      tokens.accessToken,
      cookieOptions(ms(this.jwtConfigService.jwtAccessExpire as StringValue)),
    );
    res.cookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      tokens.refreshToken,
      cookieOptions(ms(this.jwtConfigService.jwtRefreshExpire as StringValue)),
    );
    return {
      accessToken: '........',
      refreshToken: '........',
    };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    await this.authService.logout(req);
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
    return {
      accessToken: '?',
      refreshToken: '?',
    };
  }
}
