import thumbnail from '@/assets/book1.png';
import './book.page.scss';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';
import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { formatCurrency } from '@/utils/helper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import SortByMenu from '@/components/books/sortby.menu';
import { getCategoryStructure } from '@/api/book.api';
import type { ICategoryRes } from '@/types/book';

interface ICategory {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

const CATEGORIES: ICategory[] = [
  {
    id: 'fsdfdsfdsfsdfd',
    label: 'Philosophy',
    children: [
      { id: 'sdddd', label: 'Existentialism' },
      { id: 'zzzzzzsadsa', label: 'Ethics & Morality' },
    ],
  },
  {
    id: 'dfdsfdsfds',
    label: 'Comic',
    children: [
      { id: '123232', label: 'copilot' },
      { id: '123d3232', label: 'Claude code' },
    ],
  },
];

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
  const [categoryStructure, setCategoryStructure] = useState<ICategoryRes[] | null>(null);

  const handleChange = (event: Event, newValue: number[]) => {
    console.log(newValue);
    setPrice(newValue);
  };

  const handleClickCategory = (value: string) => {
    setCurrentCategory(value);
    console.log('[Category] : ' + value);
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
          onClick={() => handleClickCategory(category.name)}
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
        console.log(result);
      } catch (err: unknown) {
        setCategoryStructure(null);
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
              <input id="book-search" type="text" placeholder="Search authors or books" />
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
              <div className="book__stat">Showing 12 of 84 Titles</div>
              <div className="book__sortmenu">
                <SortByMenu />
              </div>
            </div>
            <div className="book__grid">
              {new Array(9).fill(0).map((item) => (
                <div className="book__card">
                  <div className="book__img-wrapper">
                    <img className="book__thumbnail" src={thumbnail} alt="thumbnail" />
                  </div>
                  <div className="book__content">
                    <div className="book__card-category">Philosophy</div>
                    <div className="book__card-title">The Myth of Sisyphus</div>
                    <div className="book__card-author">Albert Camus</div>
                    <div className="book__card-price">$42.00</div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
              count={10}
              color="primary"
            />
          </main>
        </div>
      </div>
    </>
  );
};
