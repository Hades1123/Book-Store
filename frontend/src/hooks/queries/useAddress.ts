import { getAddresses } from '@/api/address.api';
import { useQuery } from '@tanstack/react-query';
import { ADDRESS_KEYS } from '@/constants/queryKeys';

export const useAddress = () => {
  return useQuery({
    queryKey: ADDRESS_KEYS.list(),
    queryFn: async () => {
      const result = await getAddresses();
      return result.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
