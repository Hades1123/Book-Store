import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CheckoutDto } from './dto';
import { TOrderResponse } from './types';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(@Req() req: Request): Promise<TOrderResponse[]> {
    return this.orderService.getOrders(req.user!.sub);
  }

  @Get(':id')
  async getOrderById(@Req() req: Request, @Param('id') orderId: string): Promise<TOrderResponse> {
    return this.orderService.getOrderById(req.user!.sub, orderId);
  }

  @Post()
  async checkout(@Req() req: Request, @Body() dto: CheckoutDto): Promise<TOrderResponse> {
    return this.orderService.checkout(req.user!.sub, dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Req() req: Request, @Param('id') orderId: string): Promise<TOrderResponse> {
    return this.orderService.cancelOrder(req.user!.sub, orderId);
  }
}