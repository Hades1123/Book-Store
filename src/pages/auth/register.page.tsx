import './register.scss';
import bookIcon from '@/assets/book.svg';
import mailIcon from '@/assets/auth/mailIcon.svg';
import lockIcon from '@/assets/auth/lock.svg';
import eyeIcon from '@/assets/auth/eye.svg';
import ggIcon from '@/assets/auth/google.svg';
import fbIcon from '@/assets/auth/facebook.svg';
import phoneIcon from '@/assets/auth/phone.svg';
import confirmPass from '@/assets/auth/confirm-pass.svg';
import userIcon from '@/assets/auth/user.svg';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/auth.schema';
import type { RegisterResponse, ReqRegister } from '@/types/auth';
import { postRegister } from '@/api/auth.api';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [passwordVision, setPasswordVision] = useState<boolean>(false);
  const [confirmPassVision, setConfirmPassVision] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<ReqRegister> = async (data) => {
    const req: ReqRegister = {
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      phone: data.phone,
    };
    try {
      setLoading(true);
      const result = await postRegister(req);
      if (result.data && result.data.data) {
        const data = result.data.data;
        const successData: RegisterResponse = {
          email: data.email,
          otpExpireTime: data.otpExpireTime / 1000,
        };
        navigate('/otp', { state: successData });
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="register">
        <div className="register__header">
          <div className="register__header--left" onClick={() => navigate('/')}>
            <div>
              <img src={bookIcon} alt="icon" />
            </div>
            <span>Book Store</span>
          </div>
          <div className="register__header--right">
            <span>Already have an account?</span>
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
        <div className="register__form">
          <div className="register__form-title">
            <h2>Create Account</h2>
            <p>Join Book Store for the best book deals and early access to gadgets.</p>
          </div>
          <form className="register__form-main" onSubmit={handleSubmit(onSubmit)}>
            <div className="register__name">
              <label htmlFor="">Full Name</label>
              <div className="register__form-wrapper">
                <input type="text" {...register('fullName')} />
                <img src={userIcon} alt="userIcon" className="left" />
              </div>
              <p className="error">{errors.fullName?.message}</p>
            </div>
            <div className="register__phone">
              <label htmlFor="">Phone Number</label>
              <div className="register__form-wrapper">
                <input type="text" {...register('phone')} />
                <img src={phoneIcon} alt="phoneicon" className="left" />
              </div>
              <p className="error">{errors.phone?.message}</p>
            </div>
            <div className="register__email">
              <label htmlFor="">Email Address</label>
              <div className="register__form-wrapper">
                <input type="text" {...register('email')} />
                <img src={mailIcon} alt="mail" className="left" />
              </div>
              <p className="error">{errors.email?.message}</p>
            </div>
            <div className="register__password">
              <label htmlFor="">Password</label>
              <div className="register__form-wrapper">
                <input type={passwordVision ? 'text' : 'password'} {...register('password')} />
                <img src={lockIcon} alt="pass" className="left" />
                <img
                  src={eyeIcon}
                  className="right"
                  alt="icon"
                  onClick={() => setPasswordVision(!passwordVision)}
                />
              </div>
              <p className="error">{errors.password?.message}</p>
            </div>
            <div className="register__confirm-password">
              <label htmlFor="">Confirm password</label>
              <div className="register__form-wrapper">
                <input
                  type={confirmPassVision ? 'text' : 'password'}
                  {...register('confirmPassword')}
                />
                <img src={confirmPass} alt="confirm" className="left" />
                <img
                  src={eyeIcon}
                  alt="icon"
                  className="right"
                  onClick={() => setConfirmPassVision(!confirmPassVision)}
                />
              </div>
              <p className="error">{errors.confirmPassword?.message}</p>
            </div>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              loading={loading}
              loadingIndicator={<CircularProgress sx={{ color: 'blue', fontSize: 12 }} />}
            >
              Sign Up
            </Button>
          </form>
          <span>Or register with</span>
          <div className="register__Oauth">
            <button>
              <img src={ggIcon} alt="gg" />
              Google
            </button>
            <button>
              <img src={fbIcon} alt="fb" /> Facebook
            </button>
          </div>
          <div className="register__privacy">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </>
  );
};
