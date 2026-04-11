import './cart.page.scss';
import thumbnail from '@/assets/book1.png';
import { formatCurrency } from '@/utils/helper';
import { CartInput } from '@/components/cart/cart.input';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CartIcon from '@/assets/cart.svg?react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import { useCartMutation } from '@/hooks/mutations/useCartMutation';
import { useCart, useTotalPrice } from '@/hooks/queries/useCart';

export const CartPage = () => {
  const { data: cart } = useCart();
  const { deleteCartItem, updateCartItem } = useCartMutation();
  const totalPrice = useTotalPrice();

  const handleDeleteCartItem = (e: MouseEvent<SVGSVGElement>, productId: string) => {
    e.preventDefault();
    deleteCartItem.mutate(productId);
  };

  const handleUpdateCartItem = (productId: string, quantity: number) => {
    updateCartItem.mutate({ productId, quantity });
  };

  return (
    <div className="collections">
      <div className="collections__header">
        <h1>Your Collection</h1>
        <span>Review your selected volumes</span>
      </div>
      {cart && cart.items.length > 0 ? (
        <div className="collections__container">
          <div className="collections__main">
            {cart?.items.map((item) => (
              <div className="collections__item">
                <div className="collections__item-container">
                  <div className="collections__img-wrapper">
                    <img src={thumbnail} alt="img" />
                  </div>
                  <div className="collections__content">
                    <div className="collections__first">
                      <div>
                        <h3 className="collections__name">{item.product.name}</h3>
                        <span className="collections__author">{item.product.author}</span>
                      </div>
                      <span className="collections__price">
                        {formatCurrency(Number(item.product.price))}
                      </span>
                    </div>
                    <div className="collections__second">
                      <div className="collections__second--left">
                        <CartInput
                          item={item}
                          handleDeleteCartItem={handleDeleteCartItem}
                          handleUpdateCartItem={handleUpdateCartItem}
                        />
                        <div
                          className="collections__remove"
                          onClick={() => deleteCartItem.mutate(item.productId)}
                        >
                          <DeleteOutlineOutlinedIcon />
                          <span>Remove</span>
                        </div>
                      </div>
                      <div className="collections__second--right">
                        <div className="collections__total-price">
                          {formatCurrency(item.quantity * Number(item.product.price))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="collections__checkout">
            <div className="collections__summary">Order Summary</div>
            <div className="collections__fee">
              <div className="collections__subtotal">
                <div className="collections__subtotal-title">Subtotal (3 items)</div>
                <div className="collections__subtotal-price">$61.00</div>
              </div>
              <div className="collections__grand">
                <div className="collections__grand-title">Tax</div>
                <div className="collections__grand-price">$0</div>
              </div>
            </div>
            <div className="collections__final">
              <h6>Grand total</h6>
              <span>{formatCurrency(Number(totalPrice))}</span>
            </div>
            <Link to={'/checkout'}>
              <button className="collections__btn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="collections__empty">
          <CartIcon className="collections_empty-icon" />
          <span>No availble items</span>
        </div>
      )}
      <Link to={'/book'} className="collections__continue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="28"
          viewBox="0 0 25 28"
          fill="none"
        >
          <path
            d="M7.95093 14.9722L13.3954 20.4167L12.01 21.7778L4.23218 14L12.01 6.22222L13.3954 7.58333L7.95093 13.0278H19.7877V14.9722H7.95093Z"
            fill="#A43716"
          />
        </svg>
        <span>Continue Exploring the Archives</span>
      </Link>
    </div>
  );
};
