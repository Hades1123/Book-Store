import { create } from 'zustand';
import { getUserProfile } from '@/api/user.api';
import type { IUser } from '@/types/user';
import { postLogout } from '@/api/auth.api';
import type { QueryClient } from '@tanstack/react-query';

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logoutAction: (queryClient: QueryClient) => Promise<void>;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const result = await getUserProfile();
      set({ user: result?.data ?? null });
    } catch (err) {
      console.error(err);
      set({ user: null });
    }
    set({ isLoading: false });
  },

  setUser: (user) => set({ user }),

  logoutAction: async (queryClient) => {
    try {
      await postLogout();
      queryClient.clear();
      set({ user: null });
      window.location.href = '/login';
    } catch (err: unknown) {
      console.error(err);
    }
  },
}));

// Convenience getters (call from anywhere, even outside React)
export const getUser = () => useAuthStore.getState().user;
export const isAuthenticated = () => useAuthStore.getState().user !== null;
