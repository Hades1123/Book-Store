import { formatCurrency } from '@/utils/helper';
import './cart.popover.scss';
import thumbnail from '@/assets/book1.png';
import { Link } from 'react-router';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCartContext } from '@/contexts/cart.context';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { type MouseEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { CartInput } from './cart.input';

export const CartPopover = () => {
  const { cart, totalPrice, deleteCartItem, updateCartItem, loadingItems } = useCartContext();

  const handleDeleteCartItem = (e: MouseEvent<SVGSVGElement>, productId: string) => {
    e.preventDefault();
    deleteCartItem(productId);
  };

  const handleUpdateCartItem = (productId: string, quantity: number) => {
    updateCartItem(productId, quantity);
  };

  return (
    <IconButton className="cartpopover">
      <ShoppingCartOutlinedIcon />
      <div className="cartpopover__dropdown">
        <div className={`cartpopover__container`}>
          <h2 className="cartpopover__title">Your collection</h2>
          <div className="cartpopover__hr" />
          {cart?.items.map((item) => (
            <div className={`cartpopover__item`} key={item.id}>
              {loadingItems.has(item.productId) && (
                <div className="cartpopover__overlay">
                  <CircularProgress size={20} />
                </div>
              )}
              <div className="cartpopover__main">
                <Link to={`/book/${item.productId}`}>
                  <div className="cartpopover__img-wrapper">
                    <img src={thumbnail} alt="thumbnail" />
                  </div>
                </Link>
                <div className="cartpopover__content">
                  <Link to={`/book/${item.productId}`} className="cartpopover__name">
                    {item.product.name}
                  </Link>
                  <div className="cartpopover__price">
                    {formatCurrency(Number(item.product.price))}
                  </div>
                  {/* cart input  */}
                  <CartInput
                    handleDeleteCartItem={handleDeleteCartItem}
                    handleUpdateCartItem={handleUpdateCartItem}
                    item={item}
                  />
                </div>
              </div>
              <DeleteOutlineOutlinedIcon
                sx={{ alignSelf: 'start', ':hover': { color: 'red' } }}
                onClick={(e) => handleDeleteCartItem(e, item.productId)}
              />
            </div>
          ))}
          {cart?.items.length == 0 && <div>No available books</div>}
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
