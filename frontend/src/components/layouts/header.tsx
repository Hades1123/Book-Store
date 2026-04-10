import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@mui/material/Button';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { useState, type MouseEvent } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import bookIcon from '@/assets/book.svg';
import { CartPopover } from '@/components/books/cart.popover';
import { useQueryClient } from '@tanstack/react-query';

export const NAV_ITEMS = [
  {
    id: 'home-header-nav-item',
    label: 'HOME',
    path: '/',
  },
  {
    id: 'books-header-nav-item',
    label: 'BOOKS',
    path: '/book',
  },
  {
    id: 'best-header-nav-item',
    label: 'BEST SELLERS',
    path: '/sellers',
  },
  {
    id: 'about-header-nav-item',
    label: 'ABOUT',
    path: '/about',
  },
];
export const HeaderComponent = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logoutAction);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = async () => {
    logout(queryClient);
  };

  return (
    <header className="header">
      <div className="header__left" onClick={() => navigate('/')}>
        <div className="wrapper">
          <img src={bookIcon} alt="logo" />
        </div>
        <h1>Book Store</h1>
      </div>
      <ul>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            className={`header__nav-item ${location.pathname === item.path && 'header__nav-item--active'}`}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </ul>
      <div className="header__right">
        <CartPopover />
        {user ? (
          <>
            <IconButton
              aria-controls={open ? '9d918630-cd4e-4293-ad53-4e5fd3b17b3a' : undefined}
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <PersonOutlineOutlinedIcon
                sx={{
                  ':hover': {
                    color: '#d95d39',
                    cursor: 'pointer',
                  },
                }}
                id="5fafbda9-ce13-49d2-af7f-7ca74709c7f1"
              />
            </IconButton>
            <Menu
              id="9d918630-cd4e-4293-ad53-4e5fd3b17b3a"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': '5fafbda9-ce13-49d2-af7f-7ca74709c7f1',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/user');
                }}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="primary" variant="contained" onClick={() => navigate('/login')}>
            Đăng Nhập
          </Button>
        )}
      </div>
    </header>
  );
};
