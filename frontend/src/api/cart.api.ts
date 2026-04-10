import axios from './axios.customize';
import type { TCartItemResponse, TCartResponse, TMergeCart } from '@/types/cart';

export const getCartApi = async () => {
  const result = await axios.get<ApiResponse<TCartResponse>>('/cart');
  return result.data;
};

export const addToCartApi = async (productId: string, quantity: number = 1) => {
  const result = await axios.post<ApiResponse<TCartItemResponse>>('/cart/items', {
    productId,
    quantity,
  });
  return result.data;
};

export const deleteCartItemApi = async (productId: string) => {
  const result = await axios.delete<ApiResponse<TCartResponse>>(`/cart/items/${productId}`);
  return result.data;
};

export const patchCartItemApi = async (productId: string, quantity: number = 1) => {
  const result = await axios.patch<ApiResponse<TCartItemResponse>>(`/cart/items/${productId}`, {
    quantity,
  });
  return result.data;
};

export const mergeCartApi = async (mergeCart: TMergeCart) => {
  const result = await axios.post<ApiResponse<TCartResponse>>('/cart/merge', mergeCart);
  return result.data;
};
