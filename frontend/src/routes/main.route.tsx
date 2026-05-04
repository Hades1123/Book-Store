import { createBrowserRouter } from 'react-router';
import { LoginPage } from '@/pages/auth/login.page';
import { RegisterPage } from '@/pages/auth/register.page';
import { OtpPage } from '@/pages/auth/otp.page';
import { MainLayout } from '@/components/layouts/layout';
import { HomePage } from '@/pages/home.page';
import { ProfileLayout } from '@/pages/user/layout';
import { ProfileInfo } from '@/pages/user/info';
import { ProtectedRoute } from '@/routes/protected.route';
import { BookPage } from '@/pages/book/book.page';
import { DetailBookPage } from '@/pages/book/detail.page';
import { ScrollTop } from '@/components/layouts/scroll-top';
import { CartPage } from '@/pages/book/cart.page';
import { CheckoutPage } from '@/pages/checkout/checkout.page';
import { AddressPage } from '@/pages/user/address';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollTop />
        <MainLayout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'about',
        element: <div>Hello I am a coder</div>,
      },
      {
        path: 'book',
        element: <BookPage />,
      },
      {
        path: 'book/:id',
        element: <DetailBookPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <div>Admin layout</div>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <div>This is dashboard</div>,
      },
      {
        path: 'stat',
        element: <div>This is stat page</div>,
      },
    ],
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute roles={['ADMIN', 'CUSTOMER']}>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfileInfo />,
      },
      {
        path: 'address',
        element: <AddressPage />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute loginProtect>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute loginProtect>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/otp',
    element: (
      <ProtectedRoute loginProtect>
        <OtpPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
