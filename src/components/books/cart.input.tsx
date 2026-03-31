import type { TCartItemResponse } from '@/types/cart';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './cart.input.scss';
import type { MouseEvent } from 'react';

interface IProps {
  item: TCartItemResponse;
  handleDeleteCartItem: (
    e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>,
    productId: string
  ) => void;
  handleUpdateCartItem: (productId: string, quantity: number) => void;
}

export const CartInput = (props: IProps) => {
  const { item, handleDeleteCartItem, handleUpdateCartItem } = props;
  return (
    <div className="cart-input__input">
      {item.quantity === 1 ? (
        <DeleteOutlineOutlinedIcon
          sx={{ fontSize: '16px', height: 'auto' }}
          onClick={(e) => handleDeleteCartItem(e, item.productId)}
        />
      ) : (
        <div
          className="cart-input__minus"
          onClick={() => handleUpdateCartItem(item.productId, item.quantity - 1)}
        >
          <span>-</span>
        </div>
      )}
      <span>{item.quantity}</span>
      <div
        className="cart-input__plus"
        onClick={() => handleUpdateCartItem(item.productId, item.quantity + 1)}
      >
        <span>+</span>
      </div>
    </div>
  );
};
