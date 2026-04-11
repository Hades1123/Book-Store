import type { IBook } from '@/types/book';
import { formatCurrency } from '@/utils/helper';
import { Link, useNavigate } from 'react-router';
import thumbnail from '@/assets/book1.png';
import CartIcon from '@/assets/cart.svg?react';
import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import type { TProductInfo } from '@/types/cart';
import type { MouseEvent } from 'react';

export const BookCard = ({ item }: { item: IBook }) => {
  const { addToCart } = useCartMutation();
  const navigate = useNavigate();
  const handleAddToCart = (
    e: MouseEvent<HTMLButtonElement>,
    productId: string,
    product: TProductInfo
  ) => {
    e.preventDefault();
    addToCart.mutate({
      product,
      productId,
      quantity: 1,
    });
  };
  const handleBuyNow = (productId: string, quantity: number, product: TProductInfo) => {
    addToCart.mutate({ productId, quantity, product });
    navigate('/cart');
  };
  return (
    <div className="book__item-container">
      <Link to={`${item.id}`} style={{ textDecoration: 'none' }}>
        <div className="book__card">
          <div className="book__img-wrapper">
            <img className="book__thumbnail" src={thumbnail} alt="thumbnail" />
            <div className="book__detail">
              <div className="book__detail-publisher">
                {' '}
                <span>Publisher: </span>
                {item.publisher}
              </div>
              <div className="book__detail-page">
                <span>Pages: </span>
                {item.pages}
              </div>
              <div className="book__detail-language">
                {' '}
                <span>Language: </span>
                {item.language}
              </div>
            </div>
          </div>
          <div className="book__content">
            <div className="book__card-category">Philosophy</div>
            <div className="book__card-title">{item.name}</div>
            <div className="book__card-author">{item.author}</div>
            <div className="book__card-price">{formatCurrency(Number(item.price))}</div>
          </div>
        </div>
      </Link>
      <div className="book__btn">
        <button
          className="book__btn-cart"
          onClick={(e) => {
            handleAddToCart(e, item.id, {
              coverPublicId: item.coverPublicId,
              discountPrice: item.discountPrice,
              name: item.name,
              price: item.price,
              stockQuantity: item.stockQuantity,
              author: item.author,
            });
          }}
        >
          <CartIcon />
        </button>
        <button
          className="book__btn-buy"
          onClick={() => {
            handleBuyNow(item.id, 1, {
              author: item.author,
              coverPublicId: item.coverPublicId,
              discountPrice: item.discountPrice,
              name: item.name,
              price: item.price,
              stockQuantity: item.stockQuantity,
            });
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
};
