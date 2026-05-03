import axios from './axios.customize';
import type { IUser } from '@/types/user';

export const getUserProfile = async () => {
  const result = await axios.get<ApiResponse<IUser>>('/user');
  return result.data;
};

export interface UpdateUserProfileDto {
  fullName?: string;
  phone?: string;
  avatarPublicId?: string;
}

export const updateUserProfile = async (data: UpdateUserProfileDto) => {
  const result = await axios.patch<ApiResponse<IUser>>('/user', data);
  return result.data;
};
