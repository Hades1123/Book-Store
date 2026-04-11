import { Link } from 'react-router';
import { CartInput } from './cart.input';
import thumbnail from '@/assets/book1.png';
import { type MouseEvent } from 'react';
import type { TCartItemResponse } from '@/types/cart';
import { formatCurrency } from '@/utils/helper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface IProps {
  item: TCartItemResponse;
  onDelete: (e: MouseEvent<SVGSVGElement>) => void;
  onUpdate: (productId: string, quantity: number) => void;
}

export const CartPopoverItem = (props: IProps) => {
  const { item, onDelete, onUpdate } = props;

  return (
    <div className={`cartpopover__item`} key={item.productId}>
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
          {/* cart input  */}
          <CartInput handleDeleteCartItem={onDelete} handleUpdateCartItem={onUpdate} item={item} />
        </div>
      </div>
      <DeleteOutlineOutlinedIcon
        sx={{ alignSelf: 'start', ':hover': { color: 'red', cursor: 'pointer' } }}
        onClick={onDelete}
      />
    </div>
  );
};
