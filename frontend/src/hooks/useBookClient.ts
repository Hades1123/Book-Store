import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { useBookFilters } from '@/hooks/use-bookFilter';
import { useDebounce } from '@/hooks/use-debounce';
import type { TSortBy, TSortKey, TSortOrder } from '@/types/book';
import { useEffect, useState, type ChangeEvent } from 'react';

const SORT_OPTIONS: Record<TSortKey, { sortBy: TSortBy; sortOrder: TSortOrder; label: string }> = {
  'price-asc': { sortBy: 'price', sortOrder: 'asc', label: 'Price: Low to High' },
  'price-desc': { sortBy: 'price', sortOrder: 'desc', label: 'Price: High to Low' },
};

const marks = [
  { value: MIN_PRICE, label: '' },
  { value: MAX_PRICE, label: '' },
];

export const UseBookPage = () => {
  const { setFilter, setFilters, filters, resetFilters } = useBookFilters();

  // Derive initial local state from URL params (single source of truth = URL)
  const [price, setPrice] = useState<number[] | null>(() => {
    if (filters.minPrice || filters.maxPrice) {
      return [filters.minPrice ?? MIN_PRICE, filters.maxPrice ?? MAX_PRICE];
    }
    return null;
  });
  const [currentCategory, setCurrentCategory] = useState<string | null>(
    () => filters.categoryIds ?? null
  );
  const [currentSearchValue, setCurrentSearchValue] = useState<string>(() => filters.search ?? '');
  const [currentSort, setCurrentSort] = useState<TSortKey>(() => {
    const key = `${filters.sortBy ?? 'price'}-${filters.sortOrder ?? 'asc'}` as TSortKey;
    return !SORT_OPTIONS[key] ? 'price-asc' : key;
  });

  // Debounce value
  const debounceSearch = useDebounce<string>(currentSearchValue, 1000);
  const debouncePrice = useDebounce<number[] | null>(price, 1000);

  // Event function
  const handleChange = (_: Event, newValue: number[]) => {
    setPrice(newValue);
  };

  const handleChangePage = (page: number) => {
    setFilter('page', page);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchValue(event.target.value);
  };

  const handleResetAll = () => {
    resetFilters();
    window.location.reload();
  };

  const valuetext = (value: number) => {
    return `${value}`;
  };

  useEffect(() => {
    setFilter('search', debounceSearch);
  }, [debounceSearch]);

  useEffect(() => {
    if (debouncePrice == null) return;
    setFilters({
      minPrice: debouncePrice[0],
      maxPrice: debouncePrice[1],
    });
  }, [debouncePrice]);

  return {
    currentCategory,
    currentSort,
    currentSearchValue,
    price,
    debounceSearch,
    debouncePrice,
    marks,
    SORT_OPTIONS,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    setCurrentSort,
    handleChange,
    handleChangePage,
    handleSearch,
    handleResetAll,
    setCurrentCategory,
    valuetext,
  };
};
