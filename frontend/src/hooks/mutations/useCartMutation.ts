import { isAxiosError } from '@/api/axios.customize';
import { addToCartApi, deleteCartItemApi, patchCartItemApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/toast.store';
import type { TCartResponse, TLocalCartItem } from '@/types/cart';
import { convertLocalCartToTCartResponse } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCartMutation = () => {
  const user = useAuthStore.getState().user;
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async (param: TLocalCartItem) => {
      if (user) {
        return await addToCartApi(param.productId, param.quantity);
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        const existing = localCart.find((item) => item.productId === param.productId);
        if (existing) {
          existing.productId += param.quantity;
        } else {
          localCart.push(param);
        }
        localStorage.setItem(GUEST_CART, JSON.stringify(localCart));
        return convertLocalCartToTCartResponse(localCart);
      }
    },
    onSuccess: (data) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } else {
        queryClient.setQueryData(['cart'], data);
      }
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
  });

  const deleteCartItem = useMutation({
    mutationFn: async (productId: string) => {
      if (user) {
        return await deleteCartItemApi(productId);
      } else {
        const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
        const newLocalCart = localCart.filter((item) => item.productId != productId);
        localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
        return convertLocalCartToTCartResponse(newLocalCart);
      }
    },
    onMutate: async (productId: string) => {
      const previousCart = queryClient.getQueryData<TCartResponse>(['cart']);
      if (previousCart) {
        const newItems = previousCart.items.filter((item) => item.productId != productId);
        queryClient.setQueryData<TCartResponse>(['cart'], {
          ...previousCart,
          items: newItems,
          totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
        });
      }
      return { previousCart };
    },
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<TCartResponse>(['cart'], context.previousCart);
      }
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
    onSuccess: (data) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } else {
        queryClient.setQueryData(['cart'], data);
      }
      toast.success('Xóa sản phẩm thành công');
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (user) {
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
      const previousCart = queryClient.getQueryData<TCartResponse>(['cart']);
      if (previousCart) {
        const newItems = previousCart.items.map((item) =>
          item.productId == productId ? { ...item, quantity } : item
        );
        queryClient.setQueryData<TCartResponse>(['cart'], {
          ...previousCart,
          items: newItems,
          totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
        });
      }
      return { previousCart };
    },
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<TCartResponse>(['cart'], context.previousCart);
      }
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
    onSuccess: (data) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } else {
        queryClient.setQueryData(['cart'], data);
      }
    },
  });

  return {
    addToCart,
    deleteCartItem,
    updateCartItem,
  };
};
