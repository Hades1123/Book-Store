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
            <div className="checkout__name">
              <label htmlFor="checkout-fullname">Full name</label>
              <input type="text" id="checkout-fullname" />
            </div>
            <div className="checkout__street">
              <label htmlFor="checkout-street">Số nhà, tên đường, thôn,...</label>
              <input type="text" />
            </div>
            <div className="checkout__ward">
              <label htmlFor="checkout-ward">Phường</label>
              <input type="text" id="checkout-ward" />
            </div>
            <div className="checkout__city">
              <label htmlFor="checkout-city">City</label>
              <input type="text" id="checkout-city" />
            </div>
          </section>
          <section className="checkout__delivery">
            <div className="checkout__title">
              <span>02</span>
              <h2>Delivery Method</h2>
            </div>
            <div className="checkout__standard  checkout__method-item">
              <div className="checkout__method--left">
                <input type="radio" />
                <div className="checkout__method-name">
                  <h4>Standard Shipping</h4>
                  <span>3-5 business days</span>
                </div>
              </div>
              <div className="checkout__method--right">£4.50</div>
            </div>
            <div className="checkout__express checkout__method-item">
              <div className="checkout__method--left">
                <input type="radio" />
                <div className="checkout__method-name">
                  <h4>Express Courier</h4>
                  <span>Next business day</span>
                </div>
              </div>
              <div className="checkout__method--right">£12.00</div>
            </div>
          </section>
          <section className="checkout__payment">
            <div className="checkout__cod">
              <input type="radio" id="checkout-cod" />
              <label htmlFor="checkout-cod">COD</label>
            </div>
            <div className="checkout__qr">
              <input type="radio" />
              <label htmlFor="checkout-qr">QR Code</label>
            </div>
          </section>
        </div>
        <div className="checkout__right"></div>
      </div>
    </div>
  );
};
