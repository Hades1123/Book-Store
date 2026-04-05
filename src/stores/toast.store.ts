import type { AlertColor } from '@mui/material/Alert';
import { create } from 'zustand';

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
    set((state) => ({ toast: [...state.toast, { id, message, type, options }] }));

    setTimeout(() => {
      set((state) => ({ toast: state.toast.filter((item) => item.id != id) }));
    }, 2000);
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
