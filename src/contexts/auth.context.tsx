import { getUserProfile } from '@/api/user.api';
import type { IUser } from '@/types/user';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const result = await getUserProfile();
      if (result.data && result.data.data) {
        const data = result.data.data;
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext
      value={{
        fetchUser,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Auth context must be used in AuthProvider');
  }
  return context;
};
