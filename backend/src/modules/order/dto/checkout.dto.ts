import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
}

export class ShippingAddressDto {
  @IsString()
  receiverName: string;

  @IsString()
  phone: string;

  @IsString()
  province: string;

  @IsString()
  ward: string;

  @IsString()
  detailAddress: string;
}

export class CheckoutDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  note?: string;
}