import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CartException } from 'src/common/exceptions/cart.exception';
import { AddToCartDto, MergeCartDto, UpdateCartItemDto } from './dto';
import { TCartResponse, TCartItemResponse, TCartItemProductResponse } from './types';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCart(userId: string): Promise<TCartResponse> {
    const cart = await this.getOrCreateCart(userId);
    const items = await this.prismaService.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            discountPrice: true,
            coverPublicId: true,
            stockQuantity: true,
            author: true,
          },
        },
      },
    });

    const mappedItems: TCartItemResponse[] = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product as TCartItemProductResponse,
    }));

    return {
      id: cart.id,
      items: mappedItems,
      totalItems: items.length,
    };
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<TCartItemResponse> {
    const cart = await this.getOrCreateCart(userId);

    // Check product exists & stock
    const product = await this.prismaService.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw CartException.productNotFound();
    }
    if (product.stockQuantity < dto.quantity) {
      throw CartException.insufficientStock();
    }

    // Upsert (create or increment quantity)
    const item = await this.prismaService.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
      create: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            discountPrice: true,
            coverPublicId: true,
            stockQuantity: true,
          },
        },
      },
    });

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product as TCartItemProductResponse,
    };
  }

  async updateCartItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<TCartItemResponse> {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    if (!existingItem) {
      throw CartException.itemNotFound();
    }

    // Check stock
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (product && product.stockQuantity < dto.quantity) {
      throw CartException.insufficientStock();
    }

    const item = await this.prismaService.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: { quantity: dto.quantity },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            discountPrice: true,
            coverPublicId: true,
            stockQuantity: true,
          },
        },
      },
    });

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product as TCartItemProductResponse,
    };
  }

  async removeCartItem(userId: string, productId: string): Promise<TCartResponse> {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw CartException.itemNotFound();
    }

    await this.prismaService.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    return await this.getCart(userId);
  }

  async mergeCart(userId: string, dto: MergeCartDto): Promise<TCartResponse> {
    const cart = await this.getOrCreateCart(userId);
    // For each item from localStorage:
    // - If exists in DB cart → ignore (DB priority)
    // - If new → add to DB
    for (const item of dto.items) {
      const existing = await this.prismaService.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
      });

      if (!existing) {
        // Check product & stock
        const product = await this.prismaService.product.findUnique({
          where: { id: item.productId },
        });
        // Skip invalid items (product not found or insufficient stock)
        if (!product || product.stockQuantity < item.quantity) {
          continue;
        }

        await this.prismaService.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    return this.getCart(userId);
  }
}
