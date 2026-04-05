import { create } from 'zustand';
import { postLogout } from '@/api/auth.api';
import { getUserProfile } from '@/api/user.api';
import type { IUser } from '@/types/user';

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
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

  logout: async () => {
    set({ isLoading: true });
    try {
      await postLogout();
      set({ user: null });
    } catch (err) {
      console.error(err);
    }
    set({ isLoading: false });
  },

  setUser: (user) => set({ user }),
}));

// Convenience getters (call from anywhere, even outside React)
export const getUser = () => useAuthStore.getState().user;
export const isAuthenticated = () => useAuthStore.getState().user !== null;
