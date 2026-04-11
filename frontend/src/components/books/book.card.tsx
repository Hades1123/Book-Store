import { memo } from 'react';
import type { IBook } from '@/types/book';
import { formatCurrency } from '@/utils/helper';
import { Link } from 'react-router';
import thumbnail from '@/assets/book1.png';
import { CartButton } from './cart.btn';
import { BuyButton } from './buy.btn';

export const BookCard = memo(({ item }: { item: IBook }) => {
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
        <CartButton item={item} />
        <BuyButton item={item} />
      </div>
    </div>
  );
});
