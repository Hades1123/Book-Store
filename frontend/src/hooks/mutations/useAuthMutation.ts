import { postLogin, postRegister, postResendOtp, postVerifyEmail } from '@/api/auth.api';
import { ErrorCode } from '@/constants/enum';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/toast.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CART_KEYS } from '@/constants/queryKeys';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { useCartMutation } from './useCartMutation';

export const UseAuthMutation = () => {
  const queryClient = useQueryClient();
  const { mergeCart } = useCartMutation();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      mergeCart.mutate();
      navigate('/');
      fetchUser();
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      toast.success('Đăng nhập thành công');
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
