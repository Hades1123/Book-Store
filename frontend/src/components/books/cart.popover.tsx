import { formatCurrency } from '@/utils/helper';
import './cart.popover.scss';
import thumbnail from '@/assets/book1.png';
import { Link, useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { type MouseEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { CartInput } from './cart.input';
import { useCart, useTotalPrice, useTotalQuantity } from '@/hooks/queries/useCart';
import { useCartMutation } from '@/hooks/mutations/useCartMutation';

export const CartPopover = () => {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const { deleteCartItem, updateCartItem } = useCartMutation();
  const totalPrice = useTotalPrice();
  const totalQuantity = useTotalQuantity();

  const handleDeleteCartItem = (e: MouseEvent<SVGSVGElement>, productId: string) => {
    e.preventDefault();
    deleteCartItem.mutate(productId);
  };

  const handleUpdateCartItem = (productId: string, quantity: number) => {
    updateCartItem.mutate({ productId, quantity });
  };

  return (
    <IconButton
      className="cartpopover"
      sx={{ position: 'relative' }}
      onClick={() => navigate('/cart')}
    >
      <ShoppingCartOutlinedIcon />
      <div className="cartpopover__badge">{totalQuantity > 99 ? '99+' : totalQuantity}</div>
      <div className="cartpopover__dropdown" onClick={(e) => e.stopPropagation()}>
        <div className={`cartpopover__container`}>
          <h2 className="cartpopover__title">Your collection</h2>
          <div className="cartpopover__hr" />
          {cart?.items.map((item) => (
            <div className={`cartpopover__item`} key={item.productId}>
              {((deleteCartItem.isPending && deleteCartItem.variables == item.productId) ||
                (updateCartItem.isPending &&
                  updateCartItem.variables.productId === item.productId)) && (
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
                sx={{ alignSelf: 'start', ':hover': { color: 'red', cursor: 'pointer' } }}
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
          <div className="cartpopover__btn" onClick={() => navigate('/cart')}>
            View Cart
          </div>
        </div>
      </div>
    </IconButton>
  );
};
