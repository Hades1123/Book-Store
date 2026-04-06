import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-code';

export class ProductException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
    super({ errorCode, message }, status);
  }

  static invalidBookID() {
    return new ProductException(ErrorCode.PRODUCT_INVALID_ID, 'Invalid id', HttpStatus.NOT_FOUND);
  }
}
