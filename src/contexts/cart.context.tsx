import { addToCartApi, deleteCartItemApi, getCartApi, patchCartItemApi } from '@/api/cart.api';
import type { TCartItemResponse, TCartResponse, TLocalCartItem, TProductInfo } from '@/types/cart';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthContext } from './auth.context';
import { GUEST_CART } from '@/constants/common';

interface ICartContext {
  cart: TCartResponse | null;
  isLoading: boolean;
  loadingItems: Set<string>;
  setCart: (value: TCartResponse) => void;
  addToCart: (productId: string, quantity: number, productInfo: TProductInfo) => void;
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

  const convertLocalCartToTCartResponse = (localCart: TLocalCartItem[]): TCartResponse => {
    const cartItems: TCartItemResponse[] = localCart.map((item, index) => {
      return {
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
      };
    });

    const totalItems = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);

    return {
      id: 0,
      items: cartItems,
      totalItems,
    };
  };

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

  const addToCart = async (productId: string, quantity: number, productInfo: TProductInfo) => {
    if (user) {
      const result = await addToCartApi(productId, quantity);
      if (result && result.data) {
        const newCart = await getCartApi();
        if (newCart && newCart.data) {
          setCart(newCart.data);
        }
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem(GUEST_CART) || '[]') as TLocalCartItem[];
      const existing = localCart.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        localCart.push({ productId, quantity, product: productInfo });
      }
      localStorage.setItem(GUEST_CART, JSON.stringify(localCart));
      setCart(convertLocalCartToTCartResponse(localCart));
    }
  };

  const deleteCartItem = async (productId: string) => {
    if (user) {
      handleLoading(productId, true);
      const result = await deleteCartItemApi(productId);
      if (result && result.data) {
        setCart(result.data);
      }
      handleLoading(productId, false);
    } else {
      const localCart = JSON.parse(localStorage.getItem(GUEST_CART) || '[]') as TLocalCartItem[];
      const newLocalCart = localCart.filter((item) => item.productId != productId);
      localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
      setCart(convertLocalCartToTCartResponse(newLocalCart));
    }
  };

  const updateCartItem = async (productId: string, quantity: number = 1) => {
    if (user) {
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
    } else {
      const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
      const newLocalCart = localCart.map((item) => {
        if (item.productId === productId) {
          item.quantity = quantity;
        }
        return item;
      });
      localStorage.setItem(GUEST_CART, JSON.stringify(newLocalCart));
      setCart(convertLocalCartToTCartResponse(newLocalCart));
    }
  };

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        setIsLoading(true);
        const result = await getCartApi();
        if (result && result.data) {
          setCart(result.data);
        }
        setIsLoading(false);
      };
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem(GUEST_CART) ?? '[]') as TLocalCartItem[];
      setCart(convertLocalCartToTCartResponse(localCart));
    }
  }, [user]);

  useEffect(() => {
    setTotalPrice(
      cart?.items.reduce((acc, cur) => acc + Number(cur.product.price) * cur.quantity, 0) ?? 0
    );
    setTotalQuantity(cart?.items.reduce((acc, cur) => acc + cur.quantity, 0) ?? 0);
  }, [cart]);

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
