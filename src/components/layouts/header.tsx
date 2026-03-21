import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useAuthContext } from '@/contexts/auth.context';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useState, type MouseEvent } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

export const HeaderComponent = () => {
  const { user, logout } = useAuthContext();
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
    try {
      logout();
      navigate('/login');
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <header>
      <h1>Book Store</h1>
      <ul>
        <li>HOME</li>
        <li>CATEGORIES</li>
        <li>BEST SELLERS</li>
        <li>ABOUT</li>
      </ul>
      <div className="header__right">
        <ShoppingCartOutlinedIcon
          sx={{
            ':hover': {
              color: '#d95d39',
              cursor: 'pointer',
            },
          }}
        />
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
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
