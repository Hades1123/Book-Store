import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-code';

export class CartException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
    super({ errorCode, message }, status);
  }

  static productNotFound() {
    return new CartException(ErrorCode.CART_PRODUCT_NOT_FOUND, 'Product not found', HttpStatus.NOT_FOUND);
  }

  static itemNotFound() {
    return new CartException(ErrorCode.CART_ITEM_NOT_FOUND, 'Item not found in cart', HttpStatus.NOT_FOUND);
  }

  static outOfStock() {
    return new CartException(ErrorCode.CART_OUT_OF_STOCK, 'Product out of stock', HttpStatus.BAD_REQUEST);
  }

  static insufficientStock() {
    return new CartException(ErrorCode.CART_INSUFFICIENT_STOCK, 'Not enough stock', HttpStatus.BAD_REQUEST);
  }
}