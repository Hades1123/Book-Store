import { LoginPage } from '@/pages/auth/login.page';
import { OtpPage } from '@/pages/auth/otp.page';
import { RegisterPage } from '@/pages/auth/register.page';
import type { RouteObject } from 'react-router';

export const AuthRoute: RouteObject[] = [
  {
    path: '/',
    element: <h1>Hello world</h1>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/otp',
    element: <OtpPage />,
  },
];
