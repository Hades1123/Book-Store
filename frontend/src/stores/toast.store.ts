import type { AlertColor } from '@mui/material/Alert';
import { create } from 'zustand';

const MAX_TOAST = 2;
const DEFAULT_DURATION = 2000;

interface ToastOptions {
  duration?: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: AlertColor;
  options?: ToastOptions;
}

interface ToastType {
  toast: ToastMessage[];
  addToast: (message: string, type: AlertColor, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastType>()((set) => ({
  toast: [],

  addToast: (message, type, options) => {
    const id = Date.now().toString();
    set((state) => ({
      toast: [...state.toast.slice(0, MAX_TOAST - 1), { id, message, type, options }],
    }));

    const timeoutId = setTimeout(() => {
      set((state) => ({ toast: state.toast.filter((item) => item.id != id) }));
      clearTimeout(timeoutId);
    }, options?.duration ?? DEFAULT_DURATION);
  },

  removeToast: (id) => {
    set((state) => ({ toast: state.toast.filter((item) => item.id != id) }));
  },
}));

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast(message, 'error', options),
};
