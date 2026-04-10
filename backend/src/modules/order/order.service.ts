import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderException } from 'src/common/exceptions/order.exception';
import { CheckoutDto, PaymentMethod } from './dto';
import { TOrderResponse, TOrderItemResponse, TPaymentResponse } from './types';

const SHIPPING_FEE = 30000;

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrders(userId: string): Promise<TOrderResponse[]> {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    return orders.map((order) => this.mapOrderToResponse(order));
  }

  async getOrderById(userId: string, orderId: string): Promise<TOrderResponse> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    if (!order) {
      throw OrderException.orderNotFound();
    }

    if (order.userId !== userId) {
      throw OrderException.notOwner();
    }

    return this.mapOrderToResponse(order);
  }

  async checkout(userId: string, dto: CheckoutDto): Promise<TOrderResponse> {
    // 1. Get cart
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw OrderException.cartEmpty();
    }

    const cartItems = await this.prismaService.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw OrderException.cartEmpty();
    }

    // 2. Validate stock
    for (const item of cartItems) {
      if (item.product.stockQuantity < item.quantity) {
        throw OrderException.insufficientStock(item.product.name);
      }
    }

    // 3. Calculate amounts
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * BigInt(item.quantity);
    }, BigInt(0));
    const finalAmount = totalAmount + BigInt(SHIPPING_FEE);

    // 4. Create order + orderItems + payment (transaction)
    const order = await this.prismaService.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          receiverName: dto.shippingAddress.receiverName,
          receiverPhone: dto.shippingAddress.phone,
          shippingProvince: dto.shippingAddress.province,
          shippingWard: dto.shippingAddress.ward,
          shippingDetail: dto.shippingAddress.detailAddress,
          totalAmount,
          shippingFee: BigInt(SHIPPING_FEE),
          finalAmount,
          note: dto.note,
        },
      });

      // Create orderItems
      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.product.name,
          unitPrice: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          subtotal: (item.product.discountPrice || item.product.price) * BigInt(item.quantity),
        })),
      });

      // Create payment
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: dto.paymentMethod,
          amount: finalAmount,
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Reduce stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return this.getOrderById(userId, order.id);
  }

  async cancelOrder(userId: string, orderId: string): Promise<TOrderResponse> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw OrderException.orderNotFound();
    }

    if (order.userId !== userId) {
      throw OrderException.notOwner();
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw OrderException.cannotCancel();
    }

    // Restore stock + update status
    await this.prismaService.$transaction(async (tx) => {
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });

    return this.getOrderById(userId, orderId);
  }

  private mapOrderToResponse(order: {
    id: string;
    status: string;
    receiverName: string;
    receiverPhone: string;
    shippingProvince: string;
    shippingWard: string;
    shippingDetail: string;
    totalAmount: bigint;
    shippingFee: bigint;
    finalAmount: bigint;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    orderItems: {
      id: string;
      productId: string;
      productName: string;
      unitPrice: bigint;
      quantity: number;
      subtotal: bigint;
    }[];
    payments: {
      id: string;
      method: string;
      status: string;
      amount: bigint;
      paidAt: Date | null;
    }[];
  }): TOrderResponse {
    const items: TOrderItemResponse[] = order.orderItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const payment: TPaymentResponse = order.payments[0]
      ? {
          id: order.payments[0].id,
          method: order.payments[0].method as PaymentMethod,
          status: order.payments[0].status,
          amount: order.payments[0].amount,
          paidAt: order.payments[0].paidAt,
        }
      : {
          id: '',
          method: PaymentMethod.COD,
          status: 'PENDING',
          amount: BigInt(0),
          paidAt: null,
        };

    return {
      id: order.id,
      status: order.status,
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      shippingProvince: order.shippingProvince,
      shippingWard: order.shippingWard,
      shippingDetail: order.shippingDetail,
      totalAmount: order.totalAmount,
      shippingFee: order.shippingFee,
      finalAmount: order.finalAmount,
      note: order.note,
      items,
      payment,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}