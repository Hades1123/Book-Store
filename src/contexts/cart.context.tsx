import { addToCartApi, deleteCartItemApi, getCartApi, patchCartItemApi } from '@/api/cart.api';
import type { TCartResponse } from '@/types/cart';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthContext } from './auth.context';

interface ICartContext {
  cart: TCartResponse | null;
  isLoading: boolean;
  loadingItems: Set<string>;
  setCart: (value: TCartResponse) => void;
  addToCart: (productId: string, quantity: number) => void;
  deleteCartItem: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  totalQuantity: number;
  totalPrice: number;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<TCartResponse | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const handleLoading = (productId: string, isAdding: boolean) => {
    if (isAdding) {
      setLoadingItems(new Set(loadingItems).add(productId));
    } else {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    const result = await addToCartApi(productId, quantity);
    if (result && result.data) {
      const newCart = await getCartApi();
      if (newCart && newCart.data) {
        setCart(newCart.data);
      }
    }
  };

  const deleteCartItem = async (productId: string) => {
    handleLoading(productId, true);
    const result = await deleteCartItemApi(productId);
    if (result && result.data) {
      setCart(result.data);
    }
    handleLoading(productId, false);
  };

  const updateCartItem = async (productId: string, quantity: number = 1) => {
    handleLoading(productId, true);
    const result = await patchCartItemApi(productId, quantity);
    if (result && result.data) {
      const newCartItems =
        cart?.items.map((item) => {
          if (item.id == result.data?.id) {
            item.quantity = result.data.quantity;
          }
          return item;
        }) ?? [];
      const newTotalItems = newCartItems?.reduce((acc, cur) => acc + cur.quantity, 0) ?? 0;
      setCart(
        cart === null ? null : { id: cart.id, totalItems: newTotalItems, items: newCartItems }
      );
    }
    handleLoading(productId, false);
  };

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const result = await getCartApi();
      if (result && result.data) {
        setCart(result.data);
      }
      setIsLoading(false);
    };
    if (user) {
      fetchCart();
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parseLocalCart = JSON.parse(localCart) as TCartResponse;
      }
    }
  }, []);

  return (
    <CartContext
      value={{
        cart,
        isLoading,
        loadingItems,
        setCart,
        addToCart,
        deleteCartItem,
        updateCartItem,
        totalPrice,
        totalQuantity,
      }}
    >
      {children}
    </CartContext>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('You must use Cart Context within Cart Provider !!!');
  }
  return context;
};
