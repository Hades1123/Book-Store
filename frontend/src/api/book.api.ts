import axios from './axios.customize';
import type { IBook, IBooksParams, IBooksRes, ICategoryRes } from '@/types/book';

export const getCategoryStructure = async () => {
  const result = await axios.get<ApiResponse<ICategoryRes[]>>('/categories');
  return result.data;
};

export const fetchBooks = async (params: IBooksParams) => {
  const result = await axios.get<ApiResponse<IBooksRes>>('/books', { params: params });
  return result.data;
};

export const fetchBookById = async (id: string) => {
  const result = await axios.get<ApiResponse<IBook>>(`books/${id}`);
  return result.data;
};
