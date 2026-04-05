import type { ApiResponse } from '@/types/api';
import axios from './axios.customize';
import type { IUser } from '@/types/user';

export const getUserProfile = async () => {
  const result = await axios.get<ApiResponse<IUser>>('/user');
  return result.data;
};
