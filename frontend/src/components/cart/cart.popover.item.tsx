import { Link } from 'react-router';
import thumbnail from '@/assets/book1.png';
import type { TCartItemResponse } from '@/types/cart';
import { formatCurrency } from '@/utils/helper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { memo } from 'react';
import { CartButton } from './cart.btn';

interface IProps {
  item: TCartItemResponse;
  onDelete: (productId: string) => void;
  onUpdate: (productId: string, quantity: number) => void;
}

export const CartPopoverItem = memo(({ item, onDelete }: IProps) => {
  return (
    <div className={`cartpopover__item`}>
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
          <div className="cartpopover__price">{formatCurrency(Number(item.product.price))}</div>
          <CartButton
            // @ts-expect-error
            item={{
              id: item.productId,
              author: item.product.author,
              price: item.product.price,
            }}
          />
        </div>
      </div>
      <DeleteOutlineOutlinedIcon
        sx={{ alignSelf: 'start', ':hover': { color: 'red', cursor: 'pointer' } }}
        onClick={() => onDelete(item.productId)}
      />
    </div>
  );
});
