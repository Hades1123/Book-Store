import { formatCurrency } from '@/utils/helper';
import './cart.popover.scss';
import { useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart, useTotalPrice, useTotalQuantity } from '@/hooks/queries/useCart';
import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import { CartPopoverItem } from './cart.popover.item';

export const CartPopover = () => {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const { deleteCartItem, updateCartItem } = useCartMutation();
  const totalPrice = useTotalPrice();
  const totalQuantity = useTotalQuantity();

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
            <CartPopoverItem
              key={item.productId}
              item={item}
              onDelete={() => deleteCartItem.mutate(item.productId)}
              onUpdate={(productId: string, quantity: number) =>
                updateCartItem.mutate({ productId: productId, quantity: quantity })
              }
            />
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
