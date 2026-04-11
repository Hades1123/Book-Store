import type { TCartItemResponse, TCartResponse, TLocalCartItem } from '@/types/cart';

export const convertTime = (param: number): string => {
  console.log(param);
  const paramTransform = param;
  const minutes = Math.trunc(paramTransform / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (paramTransform % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const timeLeftInSeconds = (param: Date) => {
  return Math.floor((new Date(param).getTime() - Date.now()) / 1000);
};

export const sleep = async (ms: number = 3000) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(timer);
    }, ms);
  });

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const convertLocalCartToTCartResponse = (localCart: TLocalCartItem[]): TCartResponse => {
  const cartItems: TCartItemResponse[] = localCart.map((item, index) => ({
    id: index,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      coverPublicId: item.product.coverPublicId,
      discountPrice: item.product.discountPrice,
      name: item.product.name,
      price: item.product.price,
      stockQuantity: item.product.stockQuantity,
      author: item.product.author,
    },
  }));

  return {
    id: 0,
    items: cartItems,
    totalItems: cartItems.reduce((acc, cur) => acc + cur.quantity, 0),
  };
};
