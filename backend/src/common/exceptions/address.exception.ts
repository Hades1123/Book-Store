import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-code';

export class AddressException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
    super({ errorCode, message }, status);
  }

  static notFound() {
    return new AddressException(ErrorCode.ADDRESS_NOT_FOUND, 'Address not found', HttpStatus.NOT_FOUND);
  }

  static limitReached() {
    return new AddressException(
      ErrorCode.ADDRESS_LIMIT_REACHED,
      'Maximum addresses limit reached (3)',
      HttpStatus.BAD_REQUEST,
    );
  }
}