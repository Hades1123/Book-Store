import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export const useInitStores = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const authPaths = ['/login', '/register', '/otp'];
    if (!authPaths.includes(window.location.pathname)) {
      fetchUser();
    }
  }, [fetchUser]);
};
