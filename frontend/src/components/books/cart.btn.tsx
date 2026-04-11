import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import type { IBook } from '@/types/book';
import CartIcon from '@/assets/cart.svg?react';

export const CartButton = ({ item }: { item: IBook }) => {
  const { addToCart } = useCartMutation();

  return (
    <button
      className="book__btn-cart"
      onClick={(e) => {
        e.preventDefault();
        addToCart.mutate({
          productId: item.id,
          quantity: 1,
          product: {
            name: item.name,
            price: item.price,
            author: item.author,
            coverPublicId: item.coverPublicId,
            discountPrice: item.discountPrice,
            stockQuantity: item.stockQuantity,
          },
        });
      }}
    >
      <CartIcon />
    </button>
  );
};
