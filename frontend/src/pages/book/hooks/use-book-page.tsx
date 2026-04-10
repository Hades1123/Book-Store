import { fetchBooks, getCategoryStructure } from '@/api/book.api';
import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { useCartStore } from '@/stores/cart.store';
import { useBookFilters } from '@/hooks/use-bookFilter';
import { useDebounce } from '@/hooks/use-debounce';
import type { TSortBy, TSortKey, TSortOrder } from '@/types/book';
import type { TProductInfo } from '@/types/cart';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

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
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();
  // status of cart popover
  const [open, setIsOpen] = useState<boolean>(false);

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

  // tanstack query
  const { data, isLoading, isPending, isError, isFetching } = useQuery({
    queryKey: ['books', filters],
    queryFn: async () => {
      const result = await fetchBooks(filters);
      return result.data;
    },
    placeholderData: keepPreviousData,
  });

  const { data: categoryStructure = [] } = useQuery({
    queryKey: ['categoryStructure'],
    queryFn: async () => {
      const result = await getCategoryStructure();
      return result.data;
    },
  });

  // Event function
  const handleChange = (event: Event, newValue: number[]) => {
    setPrice(newValue);
  };

  const handleChangePage = (page: number) => {
    setFilter('page', page);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchValue(event.target.value);
  };

  const handleAddToCart = (
    e: MouseEvent<HTMLButtonElement>,
    productId: string,
    productInfo: TProductInfo
  ) => {
    e.preventDefault();
    addToCart(productId, 1, productInfo);
    setIsOpen(true);
  };

  const handleClickCategory = (value: { id: string; label: string }) => {
    const current = categoryStructure.find((item) => value.label === item.name);
    if (current && current.children) {
      const result = current.children.map((item) => item.id);
      result.push(value.id);
      setFilter('categoryIds', result.join(','));
    } else {
      setFilter('categoryIds', value.id);
    }
    setCurrentCategory(value.id);
  };

  const handleBuyNow = (productId: string, quantity: number, productInfo: TProductInfo) => {
    addToCart(productId, quantity, productInfo);
    navigate('/cart');
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
    setCurrentSort,
    currentSearchValue,
    price,
    debounceSearch,
    debouncePrice,
    open,
    setFilter,
    setFilters,
    resetFilters,
    data,
    isPending,
    isLoading,
    isError,
    isFetching,
    marks,
    SORT_OPTIONS,
    handleBuyNow,
    handleChange,
    handleChangePage,
    handleSearch,
    handleAddToCart,
    handleClickCategory,
    handleResetAll,
    setIsOpen,
    filters,
    setCurrentCategory,
    categoryStructure,
    valuetext,
  };
};
