import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,

  setSidebarOpen: (value: boolean) => {
    set({ sidebarOpen: value });
  },
}));
