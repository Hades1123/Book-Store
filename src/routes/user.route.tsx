import { MainLayout } from '@/components/layouts/main.layout';
import { HomePage } from '@/pages/home.page';
import type { RouteObject } from 'react-router';

export const UserRoute: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];
