import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { ICategoryRes } from './types/categories.res';
import { QueryDto } from './dto/query.dto';
import { Category } from 'src/generated/prisma/client';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('categories')
  async getCategories(): Promise<ICategoryRes[]> {
    return this.bookService.getCategoryStructure();
  }

  @Get('categories/:id')
  async getCategoriesChildren(@Param('id') id: string): Promise<Category[]> {
    return this.bookService.getChildrenCategory(id);
  }

  @Get('books')
  async getBooks(@Query() query: QueryDto) {
    return this.bookService.getBooks(query);
  }
}
