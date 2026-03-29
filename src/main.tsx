import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '@/styles/reset.css';
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
import { MainLayout } from './components/layouts/layout';
import { HomePage } from './pages/home.page';
import { ProfileLayout } from './pages/user/layout';
import { ProfileInfo } from './pages/user/info';
import { ProtectedRoute } from '@/components/routes/protected.route';
import { BookPage } from '@/pages/book/book.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailBookPage } from '@/pages/book/detail.page';
import { ScrollTop } from '@/components/layouts/scroll-top';
import { CartProvider } from '@/contexts/cart.context';

export const router = createBrowserRouter([
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
        element: <div>This is address routes</div>,
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
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
