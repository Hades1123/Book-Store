import type { ApiResponse } from '@/types/api';
import axios from './axios.customize';
import type { TCartItemResponse, TCartResponse } from '@/types/cart';

export const getCartApi = async () => {
  try {
    const result = await axios.get<ApiResponse<TCartResponse>>('/cart');
    return result.data;
  } catch (err: unknown) {
    console.error(err);
  }
};

export const addToCartApi = async (productId: string, quantity: number = 1) => {
  try {
    const result = await axios.post<ApiResponse<TCartItemResponse>>('/cart/items', {
      productId,
      quantity,
    });
    return result.data;
  } catch (err: unknown) {
    console.error(err);
  }
};

export const deleteCartItemApi = async (productId: string) => {
  try {
    const result = await axios.delete<ApiResponse<TCartResponse>>(`/cart/items/${productId}`);
    return result.data;
  } catch (err: unknown) {
    console.error(err);
  }
};

export const patchCartItemApi = async (productId: string, quantity: number = 1) => {
  try {
    const result = await axios.patch<ApiResponse<TCartItemResponse>>(`/cart/items/${productId}`, {
      quantity,
    });
    return result.data;
  } catch (err: unknown) {
    console.error(err);
  }
};
