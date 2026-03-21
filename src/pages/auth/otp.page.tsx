import './otp.scss';
import rocketIcon from '@/assets/auth/rocket.svg';
import blueRocketIcon from '@/assets/auth/blueRocket.svg';
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { convertTime, sleep } from '@/utils/helper';
import type { RegisterResponse, ReqVerifyEmail } from '@/types/auth';
import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postResendOtp, postVerifyEmail } from '@/api/auth.api';
import { AlertComponent, type TStatus as TAlertStatus } from '@/components/ui/toast';
import Button from '@mui/material/Button';
import { isAxiosError } from '@/api/axios.customize';
import type { ApiError } from '@/types/api';
import CircularProgress from '@mui/material/CircularProgress';

const schema = z.object({
  otp: z.string(),
});

export const OtpPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<TAlertStatus>({
    message: 'Success',
    success: true,
    open: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  const { state }: { state: RegisterResponse } = location;
  const [time, setTime] = useState<number>(state.otpExpireTime);

  const onSubmit: SubmitHandler<{ otp: string }> = async (data) => {
    const req: ReqVerifyEmail = {
      email: state.email,
      otp: data.otp,
      otpType: 'EMAIL_VERIFICATION',
    };
    try {
      setLoading(true);
      const result = await postVerifyEmail(req);
      if (result.data) {
        const data = result.data;
        setAlertStatus({
          message: 'Register successfully, redirect to login after ',
          success: data.success,
          displayCooldown: true,
          duration: 3000,
        });
        setLoading(false);
        await sleep(3000);
        navigate('/login');
      }
    } catch (error: unknown) {
      if (isAxiosError<ApiError>(error) && error.response && error.response.data) {
        const err = error.response.data;
        setAlertStatus({
          message: err.error.message,
          success: err.success,
        });
      }
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      setLoading(true);
      const result = await postResendOtp({
        email: state.email,
        otpType: 'EMAIL_VERIFICATION',
      });
      if (result.data && result.data.success && result.data.data) {
        setTime(state.otpExpireTime);
        setAlertStatus({
          message: result.data.message,
          success: result.data.success,
        });
      }
    } catch (error: any) {
      if (isAxiosError<ApiError>(error) && error.response && error.response.data) {
        setAlertStatus({
          message: error.response.data.error.message,
          success: error.response.data.success,
        });
      }
    }
    setLoading(false);
  };

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
            loading={loading}
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
          >
            Resend Otp
          </Button>
          <hr />
          <Link to={'/login'}>Back to login</Link>
        </form>
        <div className="otp__footer"></div>
      </div>
      <AlertComponent
        handleClose={() => setAlertStatus({ ...alertStatus, open: false })}
        status={{ ...alertStatus, displayCooldown: true, duration: 2000 }}
      />
    </>
  );
};
