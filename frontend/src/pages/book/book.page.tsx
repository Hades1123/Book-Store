import thumbnail from '@/assets/book1.png';
import './book.page.scss';
import Slider from '@mui/material/Slider';
import { useEffect } from 'react';
import { MAX_PRICE, MIN_PRICE } from '@/constants/common';
import { formatCurrency } from '@/utils/helper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import SortByMenu from '@/components/books/sortby.menu';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router';
import CartIcon from '@/assets/cart.svg?react';
import { UseBookPage } from './hooks/use-book-page';
import { CategoryNode } from '@/components/books/category.node';
import { toast } from '@/stores/toast.store';

export const BookPage = () => {
  const {
    SORT_OPTIONS,
    currentSort,
    data,
    debouncePrice,
    debounceSearch,
    handleAddToCart,
    handleChange,
    handleChangePage,
    handleResetAll,
    handleSearch,
    isFetching,
    marks,
    setFilter,
    setFilters,
    currentSearchValue,
    price,
    filters,
    categoryStructure,
    setCurrentCategory,
    setCurrentSort,
    currentCategory,
    handleClickCategory,
    valuetext,
  } = UseBookPage();

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

  return (
    <>
      <div className="book">
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
                categoryStructure.map((item) => (
                  <CategoryNode
                    currentCategory={currentCategory}
                    handleClickCategory={handleClickCategory}
                    category={item}
                    key={item.id}
                  />
                ))}
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
                      onClick={handleResetAll}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="book__grid">
              {isFetching && (
                <Backdrop
                  sx={(theme) => ({
                    color: '#fff',
                    zIndex: theme.zIndex.drawer + 1,
                    position: 'absolute',
                  })}
                  open={isFetching}
                >
                  <CircularProgress color="primary" />
                </Backdrop>
              )}
              {data?.bookList.map((item) => (
                <div className="book__item-container">
                  <Link to={`${item.id}`} style={{ textDecoration: 'none' }}>
                    <div className="book__card">
                      <div className="book__img-wrapper">
                        <img className="book__thumbnail" src={thumbnail} alt="thumbnail" />
                        <div className="book__detail">
                          <div className="book__detail-publisher">
                            {' '}
                            <span>Publisher: </span>
                            {item.publisher}
                          </div>
                          <div className="book__detail-page">
                            <span>Pages: </span>
                            {item.pages}
                          </div>
                          <div className="book__detail-language">
                            {' '}
                            <span>Language: </span>
                            {item.language}
                          </div>
                        </div>
                      </div>
                      <div className="book__content">
                        <div className="book__card-category">Philosophy</div>
                        <div className="book__card-title">{item.name}</div>
                        <div className="book__card-author">{item.author}</div>
                        <div className="book__card-price">{formatCurrency(Number(item.price))}</div>
                      </div>
                    </div>
                  </Link>
                  <div className="book__btn">
                    <button
                      className="book__btn-cart"
                      onClick={(e) => {
                        handleAddToCart(e, item.id, {
                          coverPublicId: item.coverPublicId,
                          discountPrice: item.discountPrice,
                          name: item.name,
                          price: item.price,
                          stockQuantity: item.stockQuantity,
                          author: item.author,
                        });
                        toast.success('Thêm vào giỏ hàng thành công !');
                      }}
                    >
                      <CartIcon />
                    </button>
                    <button
                      className="book__btn-buy"
                      onClick={() => {
                        toast.error('Con me may');
                      }}
                    >
                      Buy now
                    </button>
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
