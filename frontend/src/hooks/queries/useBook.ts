import { getCategoryStructure } from '@/api/book.api';
import { useQuery } from '@tanstack/react-query';

export const useCategoryQuery = () => {
  const { data } = useQuery({
    queryKey: ['categoryStructure'],
    queryFn: async () => {
      const result = await getCategoryStructure();
      return result.data;
    },
    staleTime: Infinity, // Data never stale, no background refetch
  });

  return {
    data,
  };
};
