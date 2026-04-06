import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [CartService, PrismaService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}