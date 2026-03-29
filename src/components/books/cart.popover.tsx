import { formatCurrency } from '@/utils/helper';
import './cart.popover.scss';
import thumbnail from '@/assets/book1.png';
import { Link } from 'react-router';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCartContext } from '@/contexts/cart.context';

export const CartPopover = () => {
  const { cart, totalPrice } = useCartContext();
  return (
    <IconButton className="cartpopover">
      <ShoppingCartOutlinedIcon />
      <div className="cartpopover__dropdown">
        <div className={`cartpopover__container`}>
          <h2 className="cartpopover__title">Your collection</h2>
          <div className="cartpopover__hr" />
          {cart.map((item) => (
            <div className="cartpopover__item" key={item.book.id}>
              <div className="cartpopover__img-wrapper">
                <img src={thumbnail} alt="thumbnail" />
              </div>
              <div className="cartpopover__content">
                <Link to={'/'} className="cartpopover__name">
                  {item.book.name}
                </Link>
                <div className="cartpopover__price">{formatCurrency(Number(item.book.price))}</div>
                <div className="cartpopover__input">Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}
          {cart.length == 0 && <div>No available books</div>}
          <div className="cartpopover__hr" />
          <div className="cartpopover__subtotal">
            <span className="cartpopover__subtotal-title">Subtotal</span>
            <span className="cartpopover__subtotal-price">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="cartpopover__btn">View Cart</div>
        </div>
      </div>
    </IconButton>
  );
};
