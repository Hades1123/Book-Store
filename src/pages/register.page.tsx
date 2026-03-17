import './register.scss';
import rocketIcon from '@/assets/auth/rocket.svg';
import mailIcon from '@/assets/auth/mailIcon.svg';
import lockIcon from '@/assets/auth/lock.svg';
import eyeIcon from '@/assets/auth/eye.svg';
import ggIcon from '@/assets/auth/google.svg';
import fbIcon from '@/assets/auth/facebook.svg';
import { useRef } from 'react';

export const RegisterPage = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const onTogglePassword = () => {
    if (passwordRef.current) {
      passwordRef.current.type =
        passwordRef.current.type == 'text' ? 'password' : 'text';
    }
  };
  return (
    <>
      <div className="register">
        <div className="register__header">
          <div className="register__header--right">
            <div>
              <img src={rocketIcon} alt="rocketIcon" />
            </div>
            <span>TechStore</span>
          </div>
          <div className="register__header--left">
            <a href="#!">Support</a>
          </div>
        </div>
        <div className="register__form">
          <h2>Welcome Back</h2>
          <p>Log in to your TechStore account to continue</p>
          <div className="register__form-input">
            <label htmlFor="7b64fb8c-cf27-4785-b026-a1d37a58f446">
              Email Address
            </label>
            <div className="register__form-wrapper">
              <input
                type="text"
                id="7b64fb8c-cf27-4785-b026-a1d37a58f446"
                placeholder="name@gmail.com"
              />
              <img src={mailIcon} className="left" alt="mailIcon" />
            </div>
          </div>
          <div className="register__form-input">
            <div className="register__form-password">
              <label htmlFor="d68caf62-b0ee-4768-bacf-43f887f255b4">
                Password
              </label>
              <a href="#!">Forgot password?</a>
            </div>
            <div className="register__form-wrapper">
              <input
                ref={passwordRef}
                type="password"
                id="d68caf62-b0ee-4768-bacf-43f887f255b4"
              />
              <img src={lockIcon} className="left" alt="lockIcon" />
              <img
                src={eyeIcon}
                onClick={onTogglePassword}
                className="right"
                alt="eyeIcon"
              />
            </div>
          </div>
          <div className="register__form-checkbox">
            <input type="checkbox" id="6f89968b-5153-40bd-8f0a-1391ba0a0235" />
            <label htmlFor="6f89968b-5153-40bd-8f0a-1391ba0a0235">
              Remember me for 30 days
            </label>
          </div>
          <button className="btn btn-primary w-100">Sign In</button>
          <span className="register__btn-sep">OR CONTINUE WITH</span>
          <div className="register__Oauth">
            <button className="register__Oauth-gg">
              <img src={ggIcon} alt="gg" /> Google
            </button>
            <button className="register__Oauth-fb">
              <img src={fbIcon} alt="fb" />
              Facebook
            </button>
          </div>
          <span>
            Don't have an account? <a href="#">Sign up for free</a>
          </span>
        </div>
        <div className="register__footer">
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookies</li>
          </ul>
          <span>© 2024 TechStore Inc. All rights reserved.</span>
        </div>
      </div>
    </>
  );
};
