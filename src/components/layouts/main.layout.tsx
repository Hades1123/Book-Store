import './main.layout.scss';
import rocketIcon from '@/assets/auth/blueRocket.svg';
import cartIcon from '@/assets/cart.svg';
import userIcon from '@/assets/user.svg';

import { Link, Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <>
      <div className="main">
        <div className="main__header">
          <div className="main__header--left">
            <ul>
              <li>
                <img src={rocketIcon} alt="logo" />
                <span>TechStore</span>
              </li>
              <li>
                <Link to={'/'}>Home</Link>
              </li>
              <li>
                <Link to={'/product'}>Products</Link>
              </li>
              <li>
                <Link to={'/'}>About us</Link>
              </li>
            </ul>
          </div>
          <div className="main__header--right">
            <input type="text" />
            <div>
              <img src={cartIcon} alt="cartIcon" />
            </div>
            <div>
              <img src={userIcon} alt="usericon" />
            </div>
          </div>
        </div>
        <Outlet />
        <div className="main__footer">
          <ul>
            <li>
              <div className="logo">
                <img src={rocketIcon} alt="logo" />
                <span>TechStore</span>
              </div>
              <p>
                The ultimate destination for premium technology. We curate the world's most
                innovative gadgets to power your lifestyle and career.
              </p>
              <div>
                <img src={rocketIcon} alt="" />
                <img src={rocketIcon} alt="" />
                <img src={rocketIcon} alt="" />
              </div>
            </li>
            <li>
              <span className="title">Shop</span>
              <span>Laptops</span>
              <span>Smartphones</span>
              <span>Tablets</span>
              <span>Audio</span>
            </li>
            <li>
              <span className="title">Support</span>
              <span>Shipping</span>
              <span>Returns</span>
              <span>Order Tracking</span>
              <span>FAQ</span>
            </li>
            <li>
              <span className="title">Company</span>
              <span>About Us</span>
              <span>Careers</span>
              <span>Privacy Policy</span>
              <span>Contact</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
