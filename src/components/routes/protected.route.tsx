import { useAuthContext } from '@/contexts/auth.context';
import { ErrorPage } from '@/pages/error.page';
import type { TRole } from '@/types/user';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

interface IProps {
  children: ReactNode;
  roles?: TRole[];
  loginProtect?: boolean;
}
export const ProtectedRoute = (props: IProps) => {
  const { children, roles = [], loginProtect = false } = props;
  const { user } = useAuthContext();
  // User have just login
  if (user && loginProtect) {
    return <Navigate to={'/'} replace />;
  }
  if (roles.length > 0 && !roles.find((item) => user?.role === item)) {
    return <ErrorPage />;
  }
  return children;
};
