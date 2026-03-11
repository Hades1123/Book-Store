import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-code';

export class AppException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ errorCode, message }, status);
  }

  static emailExist() {
    return new AppException(ErrorCode.AUTH_EMAIL_EXISTS, 'Email already registered', HttpStatus.CONFLICT);
  }

  static invalidOtp() {
    return new AppException(ErrorCode.AUTH_INVALID_OTP, 'Invalid Otp', HttpStatus.BAD_REQUEST);
  }
}
