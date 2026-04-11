import { create } from 'zustand';
import type { TCartResponse } from '@/types/cart';

interface CartState {
  cart: TCartResponse | null;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  clearCart: () => set({ cart: null }),
}));
