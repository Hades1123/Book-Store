import { create } from 'zustand';
import {
  addToCartApi,
  deleteCartItemApi,
  getCartApi,
  patchCartItemApi,
} from '@/api/cart.api';
import type {
  TCartItemResponse,
  TCartResponse,
  TLocalCartItem,
  TProductInfo,
} from '@/types/cart';
import { GUEST_CART } from '@/constants/common';
import { useAuthStore } from './auth.store';

interface CartState {
  cart: TCartResponse | null;
  isLoading: boolean;
  loadingItems: Set<string>;
  addToCart: (productId: string, quantity: number, productInfo: TProductInfo) => Promise<void>;
  deleteCartItem: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

// Helper: convert local cart to TCartResponse
const convertLocalCartToTCartResponse = (localCart: TLocalCartItem[]): TCartResponse => {
  const cartItems: TCartItemResponse[] = localCart.map((item, index) => ({
    id: index,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      coverPublicId: item.product.coverPublicId,
      discountPrice: item.product.discountPrice,
      name: item.product.name,
      price: item.product.price,
      stockQuantity: item.product.stockQuantity,
    },
  }));

  return {
    id: 0,
    items: cartItems,
    totalItems: cartItems.reduce((acc, cur) => acc + cur.quantity, 0),
  };
};

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isLoading: false,
  loadingItems: new Set(),

  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    set({ isLoading: true });

    if (user) {
      try {
        const result = await getCartApi();
        set({ cart: result?.data ?? null });
      } catch (err) {
        console.error(err);
        set({ cart: null });
      }
    } else {
      const localCart = JSON.parse(
        localStorage.getItem(GUEST_CART) ?? '[]'
      ) as TLocalCartItem[];
      set({ cart: convertLocalCartToTCartResponse(localCart) });
    }

    set({ isLoading: false });
  },

  addToCart: async (productId, quantity, productInfo) => {
    const user = useAuthStore.getState().user;

    if (user) {
      try {
        await addToCartApi(productId, quantity);
        await get().fetchCart();
      } catch (err) {
        console.error(err);
      }
    } else {
      const localCart = JSON.parse(
        localStorage.getItem(GUEST_CART) ?? '[]'
      ) as TLocalCartItem[];
      const existing = localCart.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        localCart.push({ productId, quantity, product: productInfo });
      }

      localStorage.setItem(GUEST_CART, JSON.stringify(localCart));
      set({ cart: convertLocalCartToTCartResponse(localCart) });
    }
  },

  deleteCartItem: async (productId) => {
    const user = useAuthStore.getState().user;

    if (user) {
      // Add to loading items
      set((state) => ({
        loadingItems: new Set(state.loadingItems).add(productId),
      }));

      try {
        const result = await deleteCartItemApi(productId);
        set({ cart: result?.data ?? null });
      } catch (err) {
        console.error(err);
      }

      // Remove from loading items
      set((state) => {
        const newSet = new Set(state.loadingItems);
        newSet.delete(productId);
        return { loadingItems: newSet };
      });
    } else {
      const localCart = JSON.parse(
        localStorage.getItem(GUEST_CART) ?? '[]'
      ) as TLocalCartItem[];
      const newLocalCart = localCart.filter((item) => item.productId !== productId);
      localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
      set({ cart: convertLocalCartToTCartResponse(newLocalCart) });
    }
  },

  updateCartItem: async (productId, quantity) => {
    const user = useAuthStore.getState().user;
    const cart = get().cart;

    if (user) {
      // Add to loading items
      set((state) => ({
        loadingItems: new Set(state.loadingItems).add(productId),
      }));

      try {
        const result = await patchCartItemApi(productId, quantity);
        if (result?.data && cart) {
          const newItems = cart.items.map((item) =>
            item.id === result.data?.id
              ? { ...item, quantity: result.data.quantity }
              : item
          );
          set({
            cart: {
              ...cart,
              items: newItems,
              totalItems: newItems.reduce((acc, cur) => acc + cur.quantity, 0),
            },
          });
        }
      } catch (err) {
        console.error(err);
      }

      // Remove from loading items
      set((state) => {
        const newSet = new Set(state.loadingItems);
        newSet.delete(productId);
        return { loadingItems: newSet };
      });
    } else {
      const localCart = JSON.parse(
        localStorage.getItem(GUEST_CART) ?? '[]'
      ) as TLocalCartItem[];
      const newLocalCart = localCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
      set({ cart: convertLocalCartToTCartResponse(newLocalCart) });
    }
  },

  clearCart: () => set({ cart: null }),
}));

// Computed selectors (optimized - only re-render when specific values change)
export const useTotalQuantity = () => {
  const cart = useCartStore((state) => state.cart);
  return cart?.items.reduce((acc, cur) => acc + cur.quantity, 0) ?? 0;
};

export const useTotalPrice = () => {
  const cart = useCartStore((state) => state.cart);
  return (
    cart?.items.reduce(
      (acc, cur) => acc + Number(cur.product.price) * cur.quantity,
      0
    ) ?? 0
  );
};