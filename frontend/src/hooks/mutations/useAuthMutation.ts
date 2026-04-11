import { postLogin, postRegister, postResendOtp, postVerifyEmail } from '@/api/auth.api';
import { mergeCartApi } from '@/api/cart.api';
import { GUEST_CART } from '@/constants/common';
import { ErrorCode } from '@/constants/enum';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/toast.store';
import type { TCartItemInput, TLocalCartItem } from '@/types/cart';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CART_KEYS } from '@/constants/queryKeys';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';

export const UseAuthMutation = () => {
  const queryClient = useQueryClient();
  const fetchUser = useAuthStore((state) => state.fetchUser);
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
        toast.success('Đăng nhập thành công');
        navigate('/');
        fetchUser();
        queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      }
    },
    onError: (err: unknown, variables) => {
      if (isAxiosError<ApiError>(err) && err.response && err.response.data) {
        const error = err.response.data.error;
        const message = error.message || 'Đăng nhập thất bại';
        toast.error(message);
        if (error.code == ErrorCode.AUTH_EMAIL_NOT_VERIFIED) {
          const { email, password } = variables;
          navigate('/otp', { state: { email, password } });
        }
      }
    },
  });

  const register = useMutation({
    mutationFn: postRegister,
    onSuccess: (result) => {
      toast.success(result.message);
      navigate('/login');
    },
    onError: (err: unknown) => {
      if (isAxiosError<ApiError>(err) && err.response && err.response.data) {
        const message = err.response.data.error.message || 'Đăng kí thất bại';
        toast.error(message);
      }
    },
  });

  const resendOtp = useMutation({
    mutationFn: postResendOtp,
    onSuccess: () => {
      toast.success('Gửi otp thành công');
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response) {
        toast.error(err.response.data.error.message);
      }
    },
  });

  const verifyEmail = useMutation({
    mutationFn: postVerifyEmail,
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xác thực thành công !!!');
      }
    },
    onError: (err) => {
      if (isAxiosError<ApiError>(err) && err.response?.data) {
        toast.error(err.response.data.error.message);
      }
    },
  });

  return {
    login,
    register,
    resendOtp,
    verifyEmail,
  };
};
