export type TCartItemProductResponse = {
  name: string;
  price: bigint;
  discountPrice: bigint | null;
  coverPublicId: string | null;
  stockQuantity: number;
  author: string;
};

export type TCartItemResponse = {
  id: number;
  productId: string;
  quantity: number;
  product: TCartItemProductResponse;
};

export type TCartResponse = {
  id: number;
  items: TCartItemResponse[];
  totalItems: number;
};
