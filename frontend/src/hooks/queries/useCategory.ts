import { getCategoryStructure } from '@/api/book.api';
import { useQuery } from '@tanstack/react-query';
import { CATEGORY_KEYS } from '@/constants/queryKeys';

export const useCategoryQuery = () => {
  const { data } = useQuery({
    queryKey: CATEGORY_KEYS.structure(),
    queryFn: async () => {
      const result = await getCategoryStructure();
      return result.data;
    },
  });

  return {
    data,
  };
};
