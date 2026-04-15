import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import type { IBook } from '@/types/book';
import CartIcon from '@/assets/cart.svg?react';
import { handleAddToCart } from '@/utils/cart';
import { useCart } from '@/hooks/queries/useCart';

export const CartButton = ({ item }: { item: IBook }) => {
  const { addToCart } = useCartMutation();
  const { data: cart } = useCart();

  return (
    <button
      className="book__btn-cart"
      onClick={(e) => {
        if (cart) {
          e.preventDefault();
          handleAddToCart(item, cart, addToCart);
        }
      }}
    >
      <CartIcon />
    </button>
  );
};
