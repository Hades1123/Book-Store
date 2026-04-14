import './book.page.scss';
import Slider from '@mui/material/Slider';
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
import { CategorySidebar } from '@/components/books/category.sidebar';
import { BookCard } from '@/components/books/book.card';
import { UseBookPage } from '@/hooks/use-book-page';
import { useCallback } from 'react';
import { useUIStore } from '@/stores/ui.store';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

export const BookPage = () => {
  const {
    SORT_OPTIONS,
    currentSort,
    data,
    handleChange,
    handleChangePage,
    handleResetAll,
    handleSearch,
    isLoading,
    marks,
    setFilter,
    setFilters,
    currentSearchValue,
    price,
    filters,
    setCurrentCategory,
    setCurrentSort,
    currentCategory,
    valuetext,
  } = UseBookPage();

  const isSidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  const handleCategoryClick = useCallback(
    (ids: string) => setFilter('categoryIds', ids),
    [setFilter]
  );

  const handleResetCategory = useCallback(() => {
    setCurrentCategory(null);
    setFilter('categoryIds', undefined);
  }, [setFilter, setCurrentCategory]);

  return (
    <>
      <div className="book">
        <div className="book__container">
          <Drawer
            open={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
            keepMounted={false}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 200,
                  width: '50%',
                },
              },
            }}
          >
            {
              <aside className="book__sidebar">
                <Button variant="contained" onClick={() => setSidebarOpen(false)}>
                  Close
                </Button>
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
                  <CategorySidebar
                    currentCategory={currentCategory}
                    onCategoryClick={handleCategoryClick}
                    onResetCategory={handleResetCategory}
                    setCurrentCategory={setCurrentCategory}
                  />
                </div>
              </aside>
            }
          </Drawer>
          {!isSidebarOpen && (
            <aside className="book__sidebar book__sidebar--hidden">
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
                <CategorySidebar
                  currentCategory={currentCategory}
                  onCategoryClick={handleCategoryClick}
                  onResetCategory={handleResetCategory}
                  setCurrentCategory={setCurrentCategory}
                />
              </div>
            </aside>
          )}
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
              {isLoading && (
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
              {data?.bookList.map((item) => (
                <BookCard item={item} key={item.id} />
              ))}
            </div>
            <Pagination
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
              onChange={(_, page) => handleChangePage(page)}
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
