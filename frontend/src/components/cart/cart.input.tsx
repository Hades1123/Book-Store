import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './cart.input.scss';

interface IProps {
  productId: string;
  quantity: number;
  handleDeleteCartItem: (productId: string) => void;
  handleUpdateCartItem: (productId: string, quantity: number) => void;
}

export const CartInput = (props: IProps) => {
  const { productId, quantity, handleDeleteCartItem, handleUpdateCartItem } = props;
  return (
    <div className="cart-input__btn">
      {quantity === 1 ? (
        <DeleteOutlineOutlinedIcon
          sx={{
            fontSize: '16px',
            height: 'auto',
            ':hover': {
              cursor: 'pointer',
              color: 'red',
            },
          }}
          onClick={() => handleDeleteCartItem(productId)}
        />
      ) : (
        <div
          className="cart-input__minus"
          onClick={() => handleUpdateCartItem(productId, quantity - 1)}
        >
          <span>-</span>
        </div>
      )}
      <span>{quantity}</span>
      <div
        className="cart-input__plus"
        onClick={() => handleUpdateCartItem(productId, quantity + 1)}
      >
        <span>+</span>
      </div>
    </div>
  );
};
