import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '@/constants/common';
import type { IBooksParams, TSortBy, TSortOrder } from '@/types/book';
import { useSearchParams } from 'react-router';
import { useCallback } from 'react';

export const useBookFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: IBooksParams = {
    page: Number(searchParams.get('page')) || DEFAULT_PAGE,
    limit: Number(searchParams.get('limit')) || DEFAULT_LIMIT,
    categoryIds: searchParams.get('categoryIds') || undefined,
    search: searchParams.get('search') || undefined,
    maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    minPrice: Number(searchParams.get('minPrice')) || undefined,
    sortBy: (searchParams.get('sortBy') as TSortBy) || DEFAULT_SORT_BY,
    sortOrder: (searchParams.get('sortOrder') as TSortOrder) || DEFAULT_SORT_ORDER,
  };

  const setFilter = useCallback(
    <K extends keyof IBooksParams>(key: K, value: IBooksParams[K]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }

        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const setFilters = useCallback(
    (params: Partial<IBooksParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(params).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        next.delete('page');
        return next;
      });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
};
