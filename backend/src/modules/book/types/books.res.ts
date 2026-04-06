import { TPagination } from 'src/common/types/pagination';
import { Product } from 'src/generated/prisma/client';

export interface IBookListRes {
  bookList: Product[];
  pagination: TPagination;
}
