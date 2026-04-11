import { getCartApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { useAuthStore } from '@/stores/auth.store';
import type { TLocalCartItem } from '@/types/cart';
import { convertLocalCartToTCartResponse } from '@/utils/helper';
import { useQuery } from '@tanstack/react-query';
import { CART_KEYS } from '@/constants/queryKeys';

export const useCart = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: CART_KEYS.detail(user?.id),
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
