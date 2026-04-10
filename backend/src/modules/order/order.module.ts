import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/database/prisma.service';
import { CartModule } from 'src/modules/cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [OrderService, PrismaService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}