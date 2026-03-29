import { formatCurrency } from '@/utils/helper';
import './cart.popover.scss';
import thumbnail from '@/assets/book1.png';
import { Link } from 'react-router';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const ITEMS = [
  { id: 12, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },

  { id: 122, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },
  { id: 132, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },
  { id: 142, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },
  { id: 152, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },
  { id: 172, title: 'Dế mèn phiêu lưu kí', price: 100000, quantity: 10 },
];

export const CartPopover = () => {
  return (
    <IconButton className="cartpopover">
      <ShoppingCartOutlinedIcon />
      <div className="cartpopover__dropdown">
        <div className={`cartpopover__container`}>
          <h2 className="cartpopover__title">Your collection</h2>
          <div className="cartpopover__hr" />
          {ITEMS.map((item) => (
            <div className="cartpopover__item" key={item.id}>
              <div className="cartpopover__img-wrapper">
                <img src={thumbnail} alt="thumbnail" />
              </div>
              <div className="cartpopover__content">
                <Link to={'/'} className="cartpopover__name">
                  {item.title}
                </Link>
                <div className="cartpopover__price">{formatCurrency(item.price)}</div>
                <div className="cartpopover__input"></div>
                <div className="cartpopover__total"></div>
              </div>
            </div>
          ))}
          <div className="cartpopover__hr" />
          <div className="cartpopover__subtotal">
            <span className="cartpopover__subtotal-title">Subtotal</span>
            <span className="cartpopover__subtotal-price">{formatCurrency(1000)}</span>
          </div>
          <div className="cartpopover__btn">View Cart</div>
        </div>
      </div>
    </IconButton>
  );
};
