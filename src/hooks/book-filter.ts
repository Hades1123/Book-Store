import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/common';
import type { IBooksParams } from '@/types/book';
import { useSearchParams } from 'react-router';

export const useBookFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: IBooksParams = {
    page: Number(searchParams.get('page')) || DEFAULT_PAGE,
    limit: Number(searchParams.get('limit')) || 5,
    categoryIds: searchParams.get('categoryIds') || undefined,
    search: searchParams.get('search') || undefined,
  };

  const setFilter = <K extends keyof IBooksParams>(key: K, value: IBooksParams[K]) => {
    setSearchParams((prev) => {
      if (value === null || value === undefined || value === '') {
        prev.delete(key);
      } else {
        prev.set(key, String(value));
      }

      if (key !== 'page') {
        prev.delete('page');
      }
      return prev;
    });
  };

  const setFilters = (params: Partial<IBooksParams>) => {
    setSearchParams((prev) => {
      Object.entries(params).map(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          prev.delete(key);
        } else {
          prev.set(key, String(value));
        }
      });
      return prev;
    });
  };
  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
};
