import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Category } from 'src/generated/prisma/client';
import { ICategoryRes } from './types/categories.res';
import { QueryDto } from './dto/query.dto';
import { ProductFindManyArgs, ProductWhereInput } from 'src/generated/prisma/models';
import { IBookListRes } from './types/books.res';

type ProductSortableField = 'name' | 'price';

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChildrenCategory(parentId: string): Promise<Category[]> {
    const result = await this.prismaService.category.findMany({
      where: { parentId },
    });
    return result;
  }

  async getCategoryStructure(): Promise<ICategoryRes[]> {
    const allCategories = await this.prismaService.category.findMany({});

    const parents = allCategories.filter((category) => category.parentId === null);

    return parents.map((parents) => ({
      id: parents.id,
      name: parents.name,
      children: allCategories.filter((item) => item.parentId === parents.id),
    }));
  }

  async getBooks(query: QueryDto): Promise<IBookListRes> {
    try {
      const { limit, page, maxPrice, minPrice, search, categoryIds, sortBy, sortOrder } = query;
      const skip = (page - 1) * limit;
      const categoryList = categoryIds?.split(',') ?? [];
      const whereClause: ProductWhereInput = {
        AND: [
          { price: { gte: minPrice } },
          { price: { lte: maxPrice } },
          search
            ? {
                OR: [
                  { author: { contains: search, mode: 'insensitive' } },
                  { name: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          categoryList && categoryList.length > 0
            ? {
                categoryId: { in: categoryList },
              }
            : {},
        ],
      };

      const queryObj: ProductFindManyArgs = {
        orderBy: {
          [sortBy as ProductSortableField]: sortOrder,
        },
        where: whereClause,
        skip,
        take: limit,
      };

      const total = await this.prismaService.product.count({ where: whereClause });
      const result = await this.prismaService.product.findMany(queryObj);

      return {
        bookList: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
