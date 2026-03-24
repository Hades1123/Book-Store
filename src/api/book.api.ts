import type { ApiResponse } from '@/types/api';
import axios from './axios.customize';
import type { IBooksParams, IBooksRes, ICategoryRes } from '@/types/book';

export const getCategoryStructure = () => {
  return axios.get<ApiResponse<ICategoryRes[]>>('/categories');
};

export const fetchBooks = (params: IBooksParams) => {
  return axios.get<ApiResponse<IBooksRes>>('/books', { params: params });
};
