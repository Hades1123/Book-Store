import type { ApiResponse } from '@/types/api';
import axios from './axios.customize';
import type { ICategoryRes } from '@/types/book';

export const getCategoryStructure = () => {
  return axios.get<ApiResponse<ICategoryRes[]>>('/categories');
};
