import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [AddressService, PrismaService],
  exports: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}