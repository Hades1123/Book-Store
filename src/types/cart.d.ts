import type { IBook } from './book';

interface ICart {
  book: IBook;
  quantity: number;
  totalPrice: number;
}
