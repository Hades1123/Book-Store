import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RegisterResponse } from './interfaces';
import { ResendOtpDto } from './dto/resend-otp.dto';

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
}
