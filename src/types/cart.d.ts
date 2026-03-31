import type { IBook } from './book';

interface ICart {
  book: IBook;
  quantity: number;
  totalPrice: number;
}

type TCartItemProductResponse = {
  name: string;
  price: bigint;
  discountPrice: bigint | null;
  coverPublicId: string | null;
  stockQuantity: number;
};

type TCartItemResponse = {
  id: number;
  productId: string;
  quantity: number;
  product: TCartItemProductResponse;
};

type TCartResponse = {
  id: number;
  items: TCartItemResponse[];
  totalItems: number;
};

type TProductInfo = {
  name: string;
  price: bigint;
  discountPrice: bigint | null;
  coverPublicId: string | null;
  stockQuantity: number;
};

type TLocalCartItem = {
  productId: string;
  quantity: number;
  product: TProductInfo;
};
