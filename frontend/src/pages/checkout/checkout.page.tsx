import './checkout.page.scss';
import thumbnail from '@/assets/book1.png';

const ITEMS = [
  {
    id: 1,
    name: 'The Art of Stillness',
    author: 'Pico Iyer',
    price: '£18.00',
  },
  {
    id: 2,
    name: 'The Art of Stillness',
    author: 'Pico Iyer',
    price: '£18.00',
  },
  {
    id: 3,
    name: 'The Art of Stillness',
    author: 'Pico Iyer',
    price: '£18.00',
  },
];

export const CheckoutPage = () => {
  return (
    <div className="checkout">
      <h1 className="checkout__header">Checkout</h1>
      <div className="checkout__container">
        <div className="checkout__left">
          <section className="checkout__address">
            <div className="checkout__title">
              <span>01</span>
              <h2>Shipping Address</h2>
            </div>
            <div className="checkout__name checkout__address-item">
              <label htmlFor="checkout-fullname">Full name</label>
              <input type="text" id="checkout-fullname" />
            </div>
            <div className="checkout__street checkout__address-item">
              <label htmlFor="checkout-street">Số nhà, tên đường, thôn,...</label>
              <input type="text" id="checkout-street" />
            </div>
            <div className="checkout__ward checkout__address-item">
              <label htmlFor="checkout-ward">Phường</label>
              <input type="text" id="checkout-ward" />
            </div>
            <div className="checkout__city checkout__address-item">
              <label htmlFor="checkout-city">City</label>
              <input type="text" id="checkout-city" />
            </div>
          </section>
          <section className="checkout__delivery">
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
          </section>
          <section className="checkout__payment">
            <div className="checkout__title">
              <span>03</span>
              <h2>Payment Information</h2>
            </div>
            <div className="checkout__payment-container">
              <div className="checkout__cod">
                <input type="radio" id="checkout-cod" />
                <label htmlFor="checkout-cod">COD</label>
              </div>
              <div className="checkout__qr">
                <input type="radio" id="checkout-qr" />
                <label htmlFor="checkout-qr">QR Code</label>
              </div>
            </div>
          </section>
        </div>
        <div className="checkout__right">
          <div className="checkout__summary">Order Summary</div>
          <div className="checkout__items">
            {ITEMS.map((item) => (
              <div className="checkout__item">
                <div className="checkout__img-wrapper">
                  <img src={thumbnail} alt="thumbnail" />
                </div>
                <div className="checkout__item-main">
                  <div className="checkout__item-name">{item.name}</div>
                  <div className="checkout__item-author">{item.author}</div>
                  <div className="checkout__item-quantity">Quantity: 10</div>
                  <div className="checkout__item-price">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout__totals">
            <div className="checkout__subtotal checkout__totals-item">
              <h4>Subtotal</h4>
              <span>£30.50</span>
            </div>
            <div className="checkout__shipping checkout__totals-item">
              <h4>Shipping</h4>
              <span>£4.50</span>
            </div>
            <div className="checkout__tax checkout__totals-item">
              <h4>Tax (VAT)</h4>
              <span>£3.05</span>
            </div>
          </div>
          <div className="checkout__total">
            <h4>Total</h4>
            <span>£38.05</span>
          </div>
          <button className="checkout__btn">Complete Purchase</button>
        </div>
      </div>
    </div>
  );
};
