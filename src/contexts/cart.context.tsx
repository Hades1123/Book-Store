import type { IBook } from '@/types/book';
import type { ICart } from '@/types/cart';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ICartContext {
  cart: ICart[];
  setCart: (value: ICart[]) => void;
  addToCart: (value: IBook, quantity: number) => void;
  totalQuantity: number;
  totalPrice: number;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICart[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const addToCart = (book: IBook, quantity: number) => {
    const existingBook = cart.findIndex((item) => item.book.id === book.id);
    if (existingBook != -1) {
      const newCart = cart.map((item) => {
        if (item.book.id === book.id) {
          item.quantity += quantity;
          item.totalPrice += Number(item.book.price) * quantity;
        }
        return item;
      });
      setCart(newCart);
    } else {
      setCart([...cart, { book, quantity, totalPrice: Number(book.price) * quantity }]);
    }
  };

  useEffect(() => {
    setTotalPrice(cart.reduce((acc, curr) => acc + curr.totalPrice, 0));
    setTotalQuantity(cart.reduce((acc, curr) => acc + curr.quantity, 0));
  }, [cart]);

  return (
    <CartContext
      value={{
        cart,
        setCart,
        addToCart,
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
