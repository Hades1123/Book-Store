import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-code';

export class OrderException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
    super({ errorCode, message }, status);
  }

  static orderNotFound() {
    return new OrderException(ErrorCode.ORDER_NOT_FOUND, 'Order not found', HttpStatus.NOT_FOUND);
  }

  static cartEmpty() {
    return new OrderException(ErrorCode.ORDER_CART_EMPTY, 'Cart is empty', HttpStatus.BAD_REQUEST);
  }

  static insufficientStock(productName?: string) {
    return new OrderException(
      ErrorCode.ORDER_INSUFFICIENT_STOCK,
      productName ? `Insufficient stock for ${productName}` : 'Insufficient stock',
      HttpStatus.BAD_REQUEST,
    );
  }

  static cannotCancel() {
    return new OrderException(
      ErrorCode.ORDER_CANNOT_CANCEL,
      'Cannot cancel order at this status',
      HttpStatus.BAD_REQUEST,
    );
  }

  static notOwner() {
    return new OrderException(ErrorCode.ORDER_NOT_OWNER, 'You are not the owner of this order', HttpStatus.FORBIDDEN);
  }

  static addressNotFound() {
    return new OrderException(ErrorCode.ADDRESS_NOT_FOUND, 'Address not found', HttpStatus.NOT_FOUND);
  }
}