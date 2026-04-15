import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import type { IBook } from '@/types/book';
import { useNavigate } from 'react-router';

export const BuyButton = ({ item }: { item: IBook }) => {
  const { addToCart } = useCartMutation();
  const navigate = useNavigate();
  return (
    <button
      className="book__btn-buy"
      onClick={(e) => {
        e.preventDefault();
        addToCart.mutate({
          product: {
            author: item.author,
            coverPublicId: item.coverPublicId,
            discountPrice: item.discountPrice,
            name: item.name,
            price: item.price,
            stockQuantity: item.stockQuantity,
          },
          productId: item.id,
          quantity: 1,
        });
        navigate('/checkout');
      }}
    >
      Buy now
    </button>
  );
};
