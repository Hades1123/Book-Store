import thumbnail from '@/assets/book1.png';
import './book.page.scss';
import Slider from '@mui/material/Slider';
import { useEffect, useState, type ChangeEvent } from 'react';
import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { formatCurrency } from '@/utils/helper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import SortByMenu from '@/components/books/sortby.menu';
import { fetchBooks, getCategoryStructure } from '@/api/book.api';
import { useBookFilters } from '@/hooks/use-bookFilter';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { TSortBy, TSortOrder, ICategoryRes, TSortKey } from '@/types/book';
import { Link, useNavigate } from 'react-router';
import CartIcon from '@/assets/cart.svg?react';

function valuetext(value: number) {
  return `${value}°C`;
}

const marks = [
  { value: MIN_PRICE, label: '' },
  { value: MAX_PRICE, label: '' },
];

const SORT_OPTIONS: Record<TSortKey, { sortBy: TSortBy; sortOrder: TSortOrder; label: string }> = {
  'price-asc': { sortBy: 'price', sortOrder: 'asc', label: 'Price: Low to High' },
  'price-desc': { sortBy: 'price', sortOrder: 'desc', label: 'Price: High to Low' },
  // 'name-asc': { sortBy: ESortBy.name, sortOrder: ESortOrder.asc, label: 'Name: A to Z' },
  // 'name-desc': { sortBy: ESortBy.name, sortOrder: ESortOrder.desc, label: 'Name: Z to A' },
  // newest: { sortBy: ESortBy.createdAt, sortOrder: ESortOrder.desc, label: 'Newest First' },
};

export const BookPage = () => {
  const [price, setPrice] = useState<number[] | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<TSortKey>('price-asc');
  const { setFilter, setFilters, filters, resetFilters } = useBookFilters();
  const navigate = useNavigate();
  const debounceSearch = useDebounce<string>(currentSearchValue, 1000);
  const debouncePrice = useDebounce<number[] | null>(price, 1000);

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

  const handleChange = (event: Event, newValue: number[]) => {
    setPrice(newValue);
  };

  const handleChangePage = (page: number) => {
    setFilter('page', page);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchValue(event.target.value.trim());
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

  const CategoryNode = ({
    category,
    isChild = false,
  }: {
    category: ICategoryRes;
    isChild?: boolean;
  }) => {
    return (
      <div className={`${isChild ? 'book__category-child' : 'book__category-parent'} `}>
        <span
          className={`${category.name === currentCategory ? 'book__category--active' : ''}`}
          onClick={() => handleClickCategory({ id: category.id, label: category.name })}
        >
          {category.name}
        </span>
        {category.children && (
          <div className="book__subcategory-list">
            {category.children.map((item) => (
              <CategoryNode category={item} key={item.id} isChild={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setFilter('search', debounceSearch);
  }, [debounceSearch]);

  useEffect(() => {
    if (debouncePrice == null) {
      return;
    }
    setFilters({
      minPrice: debouncePrice[0],
      maxPrice: debouncePrice[1],
    });
  }, [debouncePrice]);

  return (
    <>
      <div className="book">
        <div className="book__header">
          <h1>The Archive</h1>
          <p>
            Explore our curated selection of timeless literature, art books, and philosophical
            treatises. Each volume is chosen for its physical beauty and intellectual depth.
          </p>
        </div>
        <div className="book__container">
          <aside className="book__sidebar">
            <div className="book__search">
              <label htmlFor="book-search">Search</label>
              <input
                id="book-search"
                type="text"
                placeholder="Search authors or books"
                onChange={handleSearch}
                value={currentSearchValue}
              />
            </div>
            <div className="book__price">
              <h2>Price Range</h2>
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                marks={marks}
                step={10000}
                getAriaLabel={() => 'Temperature range'}
                value={price ?? [MIN_PRICE, MAX_PRICE]}
                onChange={handleChange}
                valueLabelDisplay="off"
                getAriaValueText={valuetext}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {formatCurrency((price && price[0]) ?? MIN_PRICE)}
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {formatCurrency((price && price[1]) ?? MAX_PRICE)}
                </Typography>
              </Box>
            </div>
            <div className="book__category">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                Category{' '}
                <RestartAltIcon
                  onClick={() => {
                    setCurrentCategory(null);
                    setFilter('categoryIds', undefined);
                  }}
                  sx={{
                    cursor: 'pointer',
                    ':hover': {
                      color: 'red',
                    },
                  }}
                />{' '}
              </h2>
              {categoryStructure &&
                categoryStructure.map((item) => <CategoryNode category={item} key={item.id} />)}
            </div>
          </aside>
          <main className="book__main">
            <div className="book__sortbar">
              <div className="book__stat">
                Showing{' '}
                {(data?.pagination.limit ?? 0) * (data?.pagination.page ?? 0) >
                (data?.pagination.total ?? 0)
                  ? (data?.pagination.total ?? 0) % (data?.pagination.limit ?? 1)
                  : data?.pagination.limit}{' '}
                of {data?.pagination.total} Titles
              </div>
              <div className="book__sortmenu">
                <SortByMenu
                  currentSort={currentSort}
                  setCurrentSort={setCurrentSort}
                  setFilters={setFilters}
                  SORT_OPTIONS={SORT_OPTIONS}
                />
                <Tooltip
                  title={<span style={{ fontSize: '1rem' }}>Reset all filters</span>}
                  placement="top"
                >
                  <IconButton>
                    <RestartAltIcon
                      sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
                      onClick={() => {
                        handleResetInput();
                        resetFilters();
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="book__grid">
              {data ? (
                data?.bookList.map((item) => (
                  <Link to={`${item.id}`} style={{ textDecoration: 'none' }}>
                    <div className="book__card">
                      <div className="book__img-wrapper">
                        <img className="book__thumbnail" src={thumbnail} alt="thumbnail" />
                        <button
                          className="book__btn-cart"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <CartIcon /> Add to cart
                        </button>
                      </div>
                      <div className="book__content">
                        <div className="book__card-category">Philosophy</div>
                        <div className="book__card-title">{item.name}</div>
                        <div className="book__card-author">{item.author}</div>
                        <div className="book__card-price">{formatCurrency(Number(item.price))}</div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <Backdrop
                  sx={(theme) => ({
                    color: '#fff',
                    zIndex: theme.zIndex.drawer + 1,
                    position: 'absolute',
                  })}
                  open={isLoading}
                >
                  <CircularProgress color="primary" />
                </Backdrop>
              )}
            </div>
            <Pagination
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
              onChange={(e, page) => handleChangePage(page)}
              count={data?.pagination.totalPages}
              page={filters.page}
              color="primary"
            />
          </main>
        </div>
      </div>
    </>
  );
};
