import './otp.scss';
import rocketIcon from '@/assets/auth/rocket.svg';
import blueRocketIcon from '@/assets/auth/blueRocket.svg';
import { Link, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { convertTime, timeLeftInSeconds } from '@/utils/helper';
import type { ReqLogin } from '@/types/auth';
import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { UseAuthMutation } from '@/hooks/mutations/useAuthMutation';
import { toast } from '@/stores/toast.store';
import { isAxiosError } from 'axios';

const schema = z.object({
  otp: z.string(),
});

export const OtpPage = () => {
  const { resendOtp, verifyEmail, login } = UseAuthMutation();
  const [time, setTime] = useState<number>(0);
  const location = useLocation();
  const { state }: { state: ReqLogin } = location;
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<{ otp: string }> = async (data) => {
    try {
      setVerifyLoading(true);
      await verifyEmail.mutateAsync({
        email: state.email,
        otp: data.otp,
        otpType: 'EMAIL_VERIFICATION',
      });
      await login.mutateAsync({ email: state.email, password: state.password });
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message);
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const onResendOtp = async () => {
    resendOtp.mutate(
      { email: state.email, otpType: 'EMAIL_VERIFICATION' },
      {
        onSuccess: (data) => {
          if (data.data) {
            setTime(timeLeftInSeconds(data.data.expiredAt));
          }
        },
      }
    );
  };

  useEffect(() => {
    if (!state.email) {
      return;
    }
    resendOtp.mutate(
      { email: state.email, otpType: 'EMAIL_VERIFICATION' },
      {
        onSuccess: (data) => {
          if (data.data) {
            setTime(timeLeftInSeconds(data.data.expiredAt));
          }
        },
      }
    );
  }, [state.email]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time == 0 || !state.email) {
        return () => {
          clearInterval(intervalId);
        };
      }
      setTime(time - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [time]);

  return (
    <>
      <div className="otp">
        <div className="otp__header">
          <div className="otp__header--left">
            <div>
              <img src={rocketIcon} alt="icon" />
            </div>
            <span>TechStore</span>
          </div>
        </div>
        <form className="otp__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="otp__form-symbol">
            <img src={blueRocketIcon} alt="icon" />
          </div>
          <div className="otp__form-title">Verify Your Email</div>
          <p>
            We've sent a 6-digit verification code to {state.email} Please enter it below to
            continue.
          </p>
          <input type="text" {...register('otp')} />
          <Button
            color="primary"
            variant="contained"
            type="submit"
            loading={verifyLoading}
            loadingIndicator={<CircularProgress sx={{ color: 'blue', fontSize: 12 }} />}
          >
            Verify Identity
          </Button>
          <span className="otp__form-question">Didn't receive the code?</span>
          <span style={{ color: '#0D6CF2', fontSize: '0.875rem' }}>
            Resend code in: <span className="otp__form-timer">{convertTime(time)}</span>
          </span>
          <Button
            variant="contained"
            color="primary"
            loadingIndicator={<CircularProgress style={{ color: 'blue', fontSize: 12 }} />}
            onClick={onResendOtp}
            disabled={time > 0}
            loading={resendOtp.isPending}
          >
            Resend Otp
          </Button>
          <hr />
          <Link to={'/login'}>Back to login</Link>
        </form>
      </div>
    </>
  );
};
