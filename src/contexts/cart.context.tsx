import { addToCartApi, deleteCartItemApi, getCartApi } from '@/api/cart.api';
import type { TCartResponse } from '@/types/cart';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthContext } from './auth.context';

interface ICartContext {
  cart: TCartResponse | null;
  setCart: (value: TCartResponse) => void;
  addToCart: (productId: string, quantity: number) => void;
  deleteCartItem: (productId: string) => void;
  totalQuantity: number;
  totalPrice: number;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [cart, setCart] = useState<TCartResponse | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

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
    const result = await deleteCartItemApi(productId);
    if (result && result.data) {
      console.log(result.data);
      setCart(result.data);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      const result = await getCartApi();
      if (result && result.data) {
        setCart(result.data);
      }
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
        setCart,
        addToCart,
        deleteCartItem,
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
