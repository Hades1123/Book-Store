import { useCartStore, useTotalPrice } from '@/stores/cart.store';
import './checkout.page.scss';
import thumbnail from '@/assets/book1.png';
import { formatCurrency } from '@/utils/helper';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type TOrderSchema } from '@/schemas/order.schema';
import { checkoutAPI } from '@/api/order.api';

const MAX_ITEMS = 3;

export const CheckoutPage = () => {
  const [numberOfItems, setNumberOfItems] = useState<number>(MAX_ITEMS);
  const cart = useCartStore((state) => state.cart);
  const subTotal = useTotalPrice();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit: SubmitHandler<TOrderSchema> = async (data) => {
    try {
      const result = await checkoutAPI(data);
      if (result.data) {
        console.log('Success', result.data);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDisplayFullItems = () => {
    if (numberOfItems === MAX_ITEMS) {
      setNumberOfItems(cart?.items.length ?? 0);
    } else {
      window.scrollTo(0, 0);
      setNumberOfItems(MAX_ITEMS);
    }
  };

  if (cart?.items.length == 0 || cart == null) {
    return <div>Carts is empty !!!</div>;
  }

  return (
    <div className="checkout">
      <h1 className="checkout__header">Checkout</h1>
      <form className="checkout__container" onSubmit={handleSubmit(onSubmit)}>
        <div className="checkout__left">
          <section className="checkout__address">
            <div className="checkout__title">
              <span>01</span>
              <h2>Shipping Address</h2>
            </div>
            <div className="checkout__name checkout__address-item">
              <label htmlFor="checkout-fullname">Họ và tên</label>
              <input type="text" id="checkout-fullname" {...register('receiverName')} />
              {errors.receiverName && (
                <span className="checkout__error">{errors.receiverName.message}</span>
              )}
            </div>
            <div className="checkout__phone checkout__address-item">
              <label htmlFor="checkout-phone">Số điện thoại</label>
              <input type="text" id="checkout-phone" {...register('phone')} />
              {errors.phone && <span className="checkout__error">{errors.phone.message}</span>}
            </div>
            <div className="checkout__street checkout__address-item">
              <label htmlFor="checkout-street">Số nhà, tên đường, thôn,...</label>
              <input type="text" id="checkout-street" {...register('detailAddress')} />
              {errors.detailAddress && (
                <span className="checkout__error">{errors.detailAddress.message}</span>
              )}
            </div>
            <div className="checkout__ward checkout__address-item">
              <label htmlFor="checkout-ward">Phường</label>
              <input type="text" id="checkout-ward" {...register('ward')} />
              {errors.ward && <span className="checkout__error">{errors.ward.message}</span>}
            </div>
            <div className="checkout__city checkout__address-item">
              <label htmlFor="checkout-city">Tỉnh / Thành phố</label>
              <input type="text" id="checkout-city" {...register('province')} />
              {errors.province && (
                <span className="checkout__error">{errors.province.message}</span>
              )}
            </div>
          </section>
          {/* <section className="checkout__delivery">
            <div className="checkout__title">
              <span>02</span>
              <h2>Delivery Method</h2>
            </div>
            <div className="checkout__delivery-container">
              <div className="checkout__standard  checkout__method-item">
                <div className="checkout__method--left">
                  <input type="radio" id="checkout__standard" />
                  <label className="checkout__method-name" htmlFor="checkout__standard">
                    <h4>Standard Shipping</h4>
                    <span>3-5 business days</span>
                  </label>
                </div>
                <div className="checkout__method--right">£4.50</div>
              </div>
              <div className="checkout__express checkout__method-item">
                <div className="checkout__method--left">
                  <input type="radio" id="checkout__express" />
                  <label className="checkout__method-name" htmlFor="checkout__express">
                    <h4>Express Courier</h4>
                    <span>Next business day</span>
                  </label>
                </div>
                <div className="checkout__method--right">£12.00</div>
              </div>
            </div>
          </section> */}
          <section className="checkout__payment">
            <div className="checkout__title">
              <span>02</span>
              <h2>Payment Information</h2>
            </div>
            <div className="checkout__payment-container">
              <div className="checkout__cod">
                <input
                  type="radio"
                  id="checkout-cod"
                  value={'COD'}
                  {...register('paymentMethod')}
                />
                <label htmlFor="checkout-cod">COD</label>
              </div>
              <div className="checkout__qr">
                <input
                  type="radio"
                  id="checkout-qr"
                  value={'VNPAY'}
                  {...register('paymentMethod')}
                />
                <label htmlFor="checkout-qr">QR Code (VNPAY)</label>
              </div>
            </div>
            {errors.paymentMethod && (
              <span className="checkout__error">{errors.paymentMethod.message}</span>
            )}
          </section>
        </div>
        <div className="checkout__right">
          <div className="checkout__summary">Order Summary</div>
          <div className="checkout__items">
            {cart ? (
              cart.items.slice(0, numberOfItems).map((item) => (
                <div className="checkout__item">
                  <div className="checkout__img-wrapper">
                    <img src={thumbnail} alt="thumbnail" />
                  </div>
                  <div className="checkout__item-main">
                    <div
                      className="checkout__item-name"
                      onClick={() => navigate(`/book/${item.productId}`)}
                    >
                      {item.product.name}
                    </div>
                    <div className="checkout__item-author">{item.product.author}</div>
                    <div className="checkout__item-quantity">
                      Số lượng: <span>{item.quantity}</span>
                    </div>
                    <div className="checkout__item-price">
                      {formatCurrency(Number(item.product.price))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Cart is empty</div>
            )}
          </div>
          {cart.items.length - MAX_ITEMS > 0 && (
            <div className="checkout__more" onClick={handleDisplayFullItems}>
              {numberOfItems == MAX_ITEMS
                ? `Xem thêm: còn ${Math.max(cart!.items.length - MAX_ITEMS, 0)} sản phẩm`
                : `Thu gọn`}
            </div>
          )}
          <div className="checkout__totals">
            <div className="checkout__subtotal checkout__totals-item">
              <h4>Tổng tiền</h4>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="checkout__shipping checkout__totals-item">
              <h4>Shipping</h4>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="checkout__tax checkout__totals-item">
              <h4>Tax (VAT)</h4>
              <span>{formatCurrency(0)}</span>
            </div>
          </div>
          <div className="checkout__total">
            <h4>Tổng cộng</h4>
            <span>{formatCurrency(subTotal)}</span>
          </div>
          <button className="checkout__btn" type="submit">
            Thanh toán
          </button>
        </div>
      </form>
    </div>
  );
};
