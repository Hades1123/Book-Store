import { fetchBookById, fetchBooks } from '@/api/book.api';
import { BOOK_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import type { IBooksParams } from '@/types/book';

export const useBooks = (filters: IBooksParams) => {
  return useQuery({
    queryKey: [BOOK_KEYS.list(filters)],
    queryFn: async () => {
      const result = await fetchBooks(filters);
      return result.data;
    },
  });
};

export const useBookDetail = (id: string) => {
  return useQuery({
    queryKey: [BOOK_KEYS.detail(id)],
    queryFn: async () => {
      const result = await fetchBookById(id);
      return result.data;
    },
    enabled: !!id,
  });
};
