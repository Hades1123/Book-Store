import { fetchBooks } from '@/api/book.api';
import { BOOK_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { useBookFilters } from '@/hooks/use-bookFilter';

export const useBookQuery = () => {
  const { filters } = useBookFilters();
  const { data: books } = useQuery({
    queryKey: [BOOK_KEYS.all],
    queryFn: async () => {
      const result = await fetchBooks(filters);
      return result.data;
    },
  });

  return {
    books,
  };
};
