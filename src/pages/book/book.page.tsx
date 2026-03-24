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
import type { ICategoryRes } from '@/types/book';
import { useBookFilters } from '@/hooks/book-filter';
import { useQuery } from '@tanstack/react-query';

function valuetext(value: number) {
  return `${value}°C`;
}

const marks = [
  { value: MIN_PRICE, label: '' },
  { value: MAX_PRICE, label: '' },
];

export const BookPage = () => {
  const [price, setPrice] = useState<number[]>([10000, 2000000]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [categoryStructure, setCategoryStructure] = useState<ICategoryRes[]>([]);
  const { setFilter, setFilters, filters, resetFilters } = useBookFilters();
  const { data, isLoading } = useQuery({
    queryKey: ['books', filters],
    queryFn: async () => {
      const result = await fetchBooks(filters);
      return result.data.data;
    },
  });

  const handleChange = (event: Event, newValue: number[]) => {
    setFilters({ maxPrice: newValue[1], minPrice: newValue[0] });
    setPrice(newValue);
  };

  const handleChangePage = (page: number) => {
    setFilter('page', page);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter('search', event.target.value);
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
    const fetchCategoryStructure = async () => {
      try {
        const result = await getCategoryStructure();
        if (result.data.data) {
          setCategoryStructure(result.data.data);
        }
      } catch (err: unknown) {
        setCategoryStructure([]);
        console.error(err);
      }
    };
    fetchCategoryStructure();
  }, []);

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
                value={price}
                onChange={handleChange}
                valueLabelDisplay="off"
                getAriaValueText={valuetext}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {formatCurrency(price[0])}
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                  {formatCurrency(price[1])}
                </Typography>
              </Box>
            </div>
            <div className="book__category">
              <h2>Category</h2>
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
                <SortByMenu />
                <button onClick={resetFilters}>Reset filter</button>
              </div>
            </div>
            <div className="book__grid">
              {data?.bookList.map((item) => (
                <div className="book__card">
                  <div className="book__img-wrapper">
                    <img className="book__thumbnail" src={thumbnail} alt="thumbnail" />
                  </div>
                  <div className="book__content">
                    <div className="book__card-category">Philosophy</div>
                    <div className="book__card-title">{item.name}</div>
                    <div className="book__card-author">{item.author}</div>
                    <div className="book__card-price">{formatCurrency(Number(item.price))}</div>
                  </div>
                </div>
              ))}
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
