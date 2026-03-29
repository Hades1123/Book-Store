import type { IPagination } from './api';

export interface ICategoryRes {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

export interface IBook {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  categoryId: string;
  price: bigint;
  publisher: string;
  isbn: string | null;
  pages: number;
  language: string;
  discountPrice: bigint | null;
  stockQuantity: number;
  coverPublicId: string | null;
  soldCount: number;
}

export interface IBooksRes {
  bookList: IBook[];
  pagination: IPagination;
}

export type TSortOrder = 'asc' | 'desc';

export type TSortBy = 'price' | 'name' | 'createdAt';

export type TSortKey = 'price-asc' | 'price-desc';

export interface IBooksParams {
  page: number;

  limit: number;

  maxPrice?: number;

  minPrice?: number;

  search?: string;

  categoryIds?: string;

  sortBy?: TSortBy;

  sortOrder?: TSortOrder;
}
