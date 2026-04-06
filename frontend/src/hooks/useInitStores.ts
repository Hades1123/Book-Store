import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export const useInitStores = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);
};
