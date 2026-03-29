import { fetchBooks, getCategoryStructure } from '@/api/book.api';
import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { useCartContext } from '@/contexts/cart.context';
import { useBookFilters } from '@/hooks/use-bookFilter';
import { useDebounce } from '@/hooks/use-debounce';
import type { IBook, TSortBy, TSortKey, TSortOrder } from '@/types/book';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';

export const UseBookPage = () => {
  const [price, setPrice] = useState<number[] | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<TSortKey>('price-asc');
  const debounceSearch = useDebounce<string>(currentSearchValue, 1000);
  const debouncePrice = useDebounce<number[] | null>(price, 1000);
  const [open, setIsOpen] = useState<boolean>(false);

  const { setFilter, setFilters, filters, resetFilters } = useBookFilters();
  const { addToCart } = useCartContext();

  const { data, isLoading } = useQuery({
    queryKey: ['books', filters],
    queryFn: async () => {
      const result = await fetchBooks(filters);
      return result.data.data;
    },
  });

  const { data: categoryStructure = [] } = useQuery({
    queryKey: ['categoryStructure'],
    queryFn: async () => {
      const result = await getCategoryStructure();
      return result.data.data;
    },
  });

  const marks = [
    { value: MIN_PRICE, label: '' },
    { value: MAX_PRICE, label: '' },
  ];

  const SORT_OPTIONS: Record<TSortKey, { sortBy: TSortBy; sortOrder: TSortOrder; label: string }> =
    {
      'price-asc': { sortBy: 'price', sortOrder: 'asc', label: 'Price: Low to High' },
      'price-desc': { sortBy: 'price', sortOrder: 'desc', label: 'Price: High to Low' },
      // 'name-asc': { sortBy: ESortBy.name, sortOrder: ESortOrder.asc, label: 'Name: A to Z' },
      // 'name-desc': { sortBy: ESortBy.name, sortOrder: ESortOrder.desc, label: 'Name: Z to A' },
      // newest: { sortBy: ESortBy.createdAt, sortOrder: ESortOrder.desc, label: 'Newest First' },
    };

  const handleChange = (event: Event, newValue: number[]) => {
    setPrice(newValue);
  };

  const handleChangePage = (page: number) => {
    setFilter('page', page);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchValue(event.target.value.trim());
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, book: IBook) => {
    e.preventDefault();
    addToCart(book, 1);
    setIsOpen(true);
  };

  const valuetext = (value: number) => {
    return `${value}°C`;
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
    setCurrentCategory(value.label);
  };

  const handleResetInput = () => {
    setCurrentSearchValue('');
    setCurrentCategory(null);
    setPrice(null);
    setCurrentSort('price-asc');
  };

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
    isLoading,
    marks,
    SORT_OPTIONS,
    handleChange,
    handleChangePage,
    handleSearch,
    handleAddToCart,
    handleClickCategory,
    handleResetInput,
    setIsOpen,
    filters,
    setCurrentCategory,
    categoryStructure,
    valuetext,
  };
};
