import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  detailAddress?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}