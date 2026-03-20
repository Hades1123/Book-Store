import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export const HeaderComponent = () => {
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
        <PersonOutlineOutlinedIcon
          sx={{
            ':hover': {
              color: '#d95d39',
              cursor: 'pointer',
            },
          }}
        />
      </div>
    </header>
  );
};
