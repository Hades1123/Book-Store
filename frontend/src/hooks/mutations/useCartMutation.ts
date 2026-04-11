import { isAxiosError } from '@/api/axios.customize';
import { addToCartApi, deleteCartItemApi, patchCartItemApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/toast.store';
import type { TCartResponse, TLocalCartItem } from '@/types/cart';
import { convertLocalCartToTCartResponse } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CART_KEYS } from '@/constants/queryKeys';

export const useCartMutation = () => {
  const queryClient = useQueryClient();

  // Read user at call time (not stale from hook init)
  const getCartKey = () => CART_KEYS.detail(useAuthStore.getState().user?.id);
  const getUser = () => useAuthStore.getState().user;

  const addToCart = useMutation({
    mutationFn: async (param: TLocalCartItem) => {
      if (getUser()) {
        return await addToCartApi(param.productId, param.quantity);
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        const existing = localCart.find((item) => item.productId === param.productId);
        if (existing) {
          existing.quantity += param.quantity;
        } else {
          localCart.push(param);
        }
        localStorage.setItem(GUEST_CART, JSON.stringify(localCart));
        return convertLocalCartToTCartResponse(localCart);
      }
    },
    onMutate: async (param: TLocalCartItem) => {
      const cartKey = getCartKey();
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData<TCartResponse>(cartKey);

      if (previousCart) {
        const existingItem = previousCart.items.find((item) => item.productId === param.productId);

        let newItems;
        if (existingItem) {
          newItems = previousCart.items.map((item) =>
            item.productId === param.productId
              ? { ...item, quantity: item.quantity + param.quantity }
              : item
          );
        } else {
          newItems = [
            ...previousCart.items,
            {
              id: Date.now(), // temporary id
              productId: param.productId,
              quantity: param.quantity,
              product: param.product,
            },
          ];
        }

        queryClient.setQueryData<TCartResponse>(cartKey, {
          ...previousCart,
          items: newItems,
          totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
        });
      }

      return { previousCart };
    },
    onSuccess: () => {
      // Refetch to get the real server state
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData<TCartResponse>(getCartKey(), context.previousCart);
      }
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
  });

  const deleteCartItem = useMutation({
    mutationFn: async (productId: string) => {
      if (getUser()) {
        return await deleteCartItemApi(productId);
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        const newLocalCart = localCart.filter((item) => item.productId != productId);
        localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
        return convertLocalCartToTCartResponse(newLocalCart);
      }
    },
    onMutate: async (productId: string) => {
      const cartKey = getCartKey();
      const previousCart = queryClient.getQueryData<TCartResponse>(cartKey);
      if (previousCart) {
        const newItems = previousCart.items.filter((item) => item.productId != productId);
        queryClient.setQueryData<TCartResponse>(cartKey, {
          ...previousCart,
          items: newItems,
          totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
        });
      }
      return { previousCart };
    },
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<TCartResponse>(getCartKey(), context.previousCart);
      }
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (getUser()) {
        return await patchCartItemApi(productId, quantity);
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        const newLocalCart = localCart.map((item) =>
          item.productId == productId ? { ...item, quantity } : item
        );
        localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
        return convertLocalCartToTCartResponse(newLocalCart);
      }
    },
    onMutate: ({ productId, quantity }) => {
      const cartKey = getCartKey();
      const previousCart = queryClient.getQueryData<TCartResponse>(cartKey);
      if (previousCart) {
        const newItems = previousCart.items.map((item) =>
          item.productId == productId ? { ...item, quantity } : item
        );
        queryClient.setQueryData<TCartResponse>(cartKey, {
          ...previousCart,
          items: newItems,
          totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
        });
      }
      return { previousCart };
    },
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<TCartResponse>(getCartKey(), context.previousCart);
      }
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });

  return {
    addToCart,
    deleteCartItem,
    updateCartItem,
  };
};
