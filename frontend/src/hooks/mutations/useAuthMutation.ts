import { postLogin, postLogout, postRegister } from '@/api/auth.api';
import { mergeCartApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { toast } from '@/stores/toast.store';
import type { ApiError } from '@/types/api';
import type { RegisterResponse } from '@/types/auth';
import type { TCartItemInput, TLocalCartItem } from '@/types/cart';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';

export const UseAuthMutation = () => {
  const navigate = useNavigate();
  const handleMergeCart = async (): Promise<boolean> => {
    const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
    const cartItemInputs: TCartItemInput[] = localCart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    const result = await mergeCartApi({
      items: cartItemInputs,
    });
    if (result && result.data) {
      localStorage.removeItem(GUEST_CART);
      return true;
    }
    return false;
  };

  const login = useMutation({
    mutationFn: postLogin,
    onSuccess: async () => {
      const mergeCartSuccess = await handleMergeCart();
      if (mergeCartSuccess) {
        window.location.href = '/';
      }
    },
    onError: (err: unknown) => {
      if (isAxiosError<ApiError>(err) && err.response && err.response.data) {
        const message = err.response.data.error.message || 'Đăng nhập thất bại';
        toast.error(message);
      }
    },
  });

  const register = useMutation({
    mutationFn: postRegister,
    onSuccess: (result) => {
      if (result.data) {
        const { email, otpExpireTime } = result.data;
        const successData: RegisterResponse = {
          email: email,
          otpExpireTime: otpExpireTime / 1000,
        };
        navigate('/', { state: successData });
      }
    },
    onError: (err: unknown) => {
      if (isAxiosError<ApiError>(err) && err.response && err.response.data) {
        const message = err.response.data.error.message || 'Đăng kí thất bại';
        toast.error(message);
      }
    },
  });

  return {
    login,
    register,
  };
};
