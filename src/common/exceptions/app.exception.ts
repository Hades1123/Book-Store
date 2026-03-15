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

  static activeOtp() {
    return new AppException(ErrorCode.AUTH_OTP_ACTIVE, 'Your otp is recently sent', HttpStatus.BAD_REQUEST);
  }

  static userNotFound() {
    return new AppException(ErrorCode.USER_NOT_FOUND, 'User not found', HttpStatus.NOT_FOUND);
  }

  static errorLogin() {
    return new AppException(
      ErrorCode.AUTH_INVALID_CREDENTIALS,
      'Username or password is invalid or your account does not exist !',
      HttpStatus.UNAUTHORIZED,
    );
  }

  static tokenExpired() {
    return new AppException(ErrorCode.AUTH_TOKEN_EXPIRED, 'Token is expired', HttpStatus.UNAUTHORIZED);
  }

  static invalidToken() {
    return new AppException(ErrorCode.AUTH_REFRESH_TOKEN_INVALID, 'Token is invalid', HttpStatus.UNAUTHORIZED);
  }

  static inActiveEmail() {
    return new AppException(ErrorCode.USER_INACTIVE, 'Email must be verified before login', HttpStatus.UNAUTHORIZED);
  }
}
