import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
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

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}