import { Type } from 'class-transformer';
import { IsInt, IsString, Min, ValidateNested } from 'class-validator';

class CartItemInput {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class MergeCartDto {
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items: CartItemInput[];
}
