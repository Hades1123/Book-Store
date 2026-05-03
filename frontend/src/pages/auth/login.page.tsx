import './login.scss';
import bookIcon from '@/assets/book.svg';
import mailIcon from '@/assets/auth/mailIcon.svg';
import lockIcon from '@/assets/auth/lock.svg';
import eyeIcon from '@/assets/auth/eye.svg';
import ggIcon from '@/assets/auth/google.svg';
import fbIcon from '@/assets/auth/facebook.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import type { ReqLogin } from '@/types/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import CircularProgress from '@mui/material/CircularProgress';
import { UseAuthMutation } from '@/hooks/mutations/useAuthMutation';

const schema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z.string(),
});

export const LoginPage = () => {
  const { login } = UseAuthMutation();
  const [passVisible, setPassVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onLogin = async (req: ReqLogin) => {
    login.mutate(req);
  };

  const onTogglePassword = () => {
    setPassVisible(!passVisible);
  };

  return (
    <>
      <div className="login">
        <div className="login__header">
          <div className="login__header--right" onClick={() => navigate('/')}>
            <div>
              <img src={bookIcon} alt="rocketIcon" />
            </div>
            <span>Book Store</span>
          </div>
          <div className="login__header--left">
            <a href="#!">Support</a>
          </div>
        </div>
        <form className="login__form" onSubmit={handleSubmit(onLogin)}>
          <h2>Welcome Back</h2>
          <p>Log in to your Book Store account to continue</p>
          <div className="login__form-input">
            <label htmlFor="7b64fb8c-cf27-4785-b026-a1d37a58f446">Email Address</label>
            <div className="login__form-wrapper">
              <input
                type="text"
                id="7b64fb8c-cf27-4785-b026-a1d37a58f446"
                placeholder="name@gmail.com"
                {...register('email')}
              />
              <img src={mailIcon} className="left" alt="mailIcon" />
            </div>
            {<span style={{ color: 'orange' }}>{errors.email?.message}</span>}
          </div>
          <div className="login__form-input">
            <div className="login__form-password">
              <label htmlFor="d68caf62-b0ee-4768-bacf-43f887f255b4">Password</label>
              <a href="#!">Forgot password?</a>
            </div>
            <div className="login__form-wrapper">
              <input
                type={passVisible ? 'text' : 'password'}
                id="d68caf62-b0ee-4768-bacf-43f887f255b4"
                {...register('password')}
              />
              <img src={lockIcon} className="left" alt="lockIcon" />
              <img src={eyeIcon} onClick={onTogglePassword} className="right" alt="eyeIcon" />
            </div>
          </div>
          <label htmlFor="6f89968b-5153-40bd-8f0a-1391ba0a0235" className="login__form-checkbox">
            <input type="checkbox" id="6f89968b-5153-40bd-8f0a-1391ba0a0235" />
            <span className="checkmark"></span>
            <span>Remember me for 30 days</span>
          </label>
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            color="primary"
            loading={login.isPending}
            type="submit"
            loadingIndicator={<CircularProgress sx={{ color: 'blue', fontSize: '12' }} />}
          >
            Sign In
          </Button>
          <span className="login__btn-sep">OR CONTINUE WITH</span>
          <div className="login__Oauth">
            <button type="button" className="login__Oauth-gg">
              <img src={ggIcon} alt="gg" /> Google
            </button>
            <button type="button" className="login__Oauth-fb">
              <img src={fbIcon} alt="fb" />
              Facebook
            </button>
          </div>
          <span>
            Don't have an account? <Link to={'/register'}>Sign up for free</Link>
          </span>
        </form>
        <div className="login__footer">
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookies</li>
          </ul>
          <span>© 2026 Book Store Inc. All rights reserved.</span>
        </div>
      </div>
    </>
  );
};
