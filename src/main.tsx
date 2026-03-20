import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '@/styles/global.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react';
import { AuthProvider } from '@/contexts/auth.context';
import { createBrowserRouter } from 'react-router';
import { LoginPage } from '@/pages/auth/login.page';
import { RegisterPage } from '@/pages/auth/register.page';
import { OtpPage } from '@/pages/auth/otp.page';

export const router = createBrowserRouter([
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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
