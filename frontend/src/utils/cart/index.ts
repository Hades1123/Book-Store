import { toast } from '@/stores/toast.store';
import type { IBook } from '@/types/book';
import type { TCartItemResponse, TCartResponse, TLocalCartItem } from '@/types/cart';
import type { UseMutationResult } from '@tanstack/react-query';

export const handleAddToCart = (
  currentBook: IBook,
  cart: TCartResponse,
  addToCart: UseMutationResult<
    TCartResponse | ApiResponse<TCartItemResponse>,
    Error,
    TLocalCartItem,
    {
      previousCart: TCartResponse | undefined;
    }
  >
) => {
  const currentItemInCart =
    cart.items.find((item) => item.productId === currentBook.id)?.quantity ?? 0;
  if (currentItemInCart + 1 > currentBook?.stockQuantity) {
    toast.error('Không đủ số lượng sản phẩm !!!');
    return;
  }
  addToCart.mutate({
    product: {
      author: currentBook.author,
      coverPublicId: currentBook.coverPublicId,
      discountPrice: currentBook.discountPrice,
      name: currentBook.name,
      price: currentBook.price,
      stockQuantity: currentBook.stockQuantity,
    },
    productId: currentBook.id,
    quantity: 1,
  });
};
