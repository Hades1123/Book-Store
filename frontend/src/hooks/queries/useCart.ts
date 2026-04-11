import { getCartApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { useAuthStore } from '@/stores/auth.store';
import type { TCartItemResponse, TCartResponse, TLocalCartItem } from '@/types/cart';
import { useQuery } from '@tanstack/react-query';

// Helper: convert local cart to TCartResponse
const convertLocalCartToTCartResponse = (localCart: TLocalCartItem[]): TCartResponse => {
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

export const useCart = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (user) {
        return (await getCartApi()).data;
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        return convertLocalCartToTCartResponse(localCart);
      }
    },
  });
};

export const useTotalQuantity = () => {
  const { data: cart } = useCart();
  return cart?.items.reduce((acc, cur) => acc + cur.quantity, 0) ?? 0;
};

export const useTotalPrice = () => {
  const { data: cart } = useCart();
  return cart?.items.reduce((acc, cur) => acc + cur.quantity * Number(cur.product.price), 0) ?? 0;
};
