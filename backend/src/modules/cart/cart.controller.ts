import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto, MergeCartDto, UpdateCartItemDto } from './dto';
import { TCartResponse, TCartItemResponse } from './types';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request): Promise<TCartResponse> {
    return this.cartService.getCart(req.user!.sub);
  }

  @Post('items')
  async addToCart(@Req() req: Request, @Body() dto: AddToCartDto): Promise<TCartItemResponse> {
    return this.cartService.addToCart(req.user!.sub, dto);
  }

  @Patch('items/:productId')
  async updateCartItem(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<TCartItemResponse> {
    return this.cartService.updateCartItem(req.user!.sub, productId, dto);
  }

  @Delete('items/:productId')
  async removeCartItem(@Req() req: Request, @Param('productId') productId: string): Promise<TCartResponse> {
    return this.cartService.removeCartItem(req.user!.sub, productId);
  }

  @Post('merge')
  async mergeCart(@Req() req: Request, @Body() dto: MergeCartDto): Promise<TCartResponse> {
    return this.cartService.mergeCart(req.user!.sub, dto);
  }
}
