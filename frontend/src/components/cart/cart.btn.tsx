import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import type { IBook } from '@/types/book';
import CartIcon from '@/assets/cart.svg?react';
import { handleAddToCart } from '@/utils/cart';
import { useCart } from '@/hooks/queries/useCart';
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { toast } from '@/stores/toast.store';
import './cart.quantity.scss';

export const CartButton = ({ item }: { item: IBook }) => {
  const { addToCart } = useCartMutation();
  const { data: cart } = useCart();
  const { updateCartItem, deleteCartItem } = useCartMutation();
  const quantity = cart?.items.find((cur) => cur.productId == item.id)?.quantity ?? 0;
  const [inputQuantity, setInputQuantity] = useState<number>(quantity);

  useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
    if (!Number.isNaN(value)) {
      setInputQuantity(value);
    }
  };

  const handleOnKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      // @ts-expect-error
      const value = parseInt(e.target.value);
      if (value + quantity > item.stockQuantity) {
        toast.error('Vượt quá số lượng trong kho');
      } else {
        updateCartItem.mutate({
          productId: item.id,
          quantity: value,
        });
        setInputQuantity(value);
      }
    }
  };
  return (
    <>
      {quantity === 0 ? (
        <button
          className="cart-quantity__default"
          onClick={(e) => {
            if (cart) {
              e.preventDefault();
              handleAddToCart(item, cart, addToCart);
            }
          }}
        >
          <CartIcon />
        </button>
      ) : quantity < 10 ? (
        <div className="cart-quantity">
          {quantity === 1 ? (
            <DeleteOutlineOutlinedIcon
              sx={{
                fontSize: '16px',
                cursor: 'pointer',
                ':hover': { color: 'red' },
              }}
              onClick={() => deleteCartItem.mutate(item.id)}
            />
          ) : (
            <div
              className="cart-quantity__btn"
              onClick={() => {
                updateCartItem.mutate({
                  productId: item.id,
                  quantity: quantity - 1,
                });
                setInputQuantity(quantity - 1);
              }}
            >
              <span>-</span>
            </div>
          )}
          <span className="cart-quantity__value">{quantity}</span>
          <div
            className="cart-quantity__btn"
            onClick={() => {
              updateCartItem.mutate({
                productId: item.id,
                quantity: quantity + 1,
              });
              setInputQuantity(quantity + 1);
            }}
          >
            <span>+</span>
          </div>
        </div>
      ) : (
        <input
          type="text"
          className="cart-quantity__input"
          value={inputQuantity}
          onKeyDown={handleOnKeydown}
          onChange={handleOnChange}
        />
      )}
    </>
  );
};
