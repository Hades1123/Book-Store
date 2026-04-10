import { create } from 'zustand';
import { getUserProfile } from '@/api/user.api';
import type { IUser } from '@/types/user';
import { postLogout } from '@/api/auth.api';
import { toast } from './toast.store';

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logoutAction: () => Promise<{ success: boolean; err?: unknown }>;
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

  logoutAction: async () => {
    try {
      await postLogout();
      set({ user: null });
      toast.success('Đăng xuất thành công !!!');
      window.location.href = '/login';
      return { success: true };
    } catch (err: unknown) {
      console.error(err);
      return { success: false, error: err };
    }
  },
}));

// Convenience getters (call from anywhere, even outside React)
export const getUser = () => useAuthStore.getState().user;
export const isAuthenticated = () => useAuthStore.getState().user !== null;
