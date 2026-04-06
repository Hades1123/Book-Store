import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_BOOK_PRICE, MIN_BOOK_PRICE } from 'src/common/constants/common';

enum ESortBy {
  price = 'price',
  name = 'name',
}

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(DEFAULT_PAGE)
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number = MAX_BOOK_PRICE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number = MIN_BOOK_PRICE;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryIds?: string;

  @IsOptional()
  @IsEnum(ESortBy)
  sortBy?: ESortBy = ESortBy.price;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
