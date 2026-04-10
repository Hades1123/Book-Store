import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { TAddressResponse } from './types';

@Controller('addresses')
@UseGuards(JwtGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async getAddresses(@Req() req: Request): Promise<TAddressResponse[]> {
    return this.addressService.getAddresses(req.user!.sub);
  }

  @Post()
  async createAddress(@Req() req: Request, @Body() dto: CreateAddressDto): Promise<TAddressResponse> {
    return this.addressService.createAddress(req.user!.sub, dto);
  }

  @Patch(':id')
  async updateAddress(
    @Req() req: Request,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<TAddressResponse> {
    return this.addressService.updateAddress(req.user!.sub, addressId, dto);
  }

  @Patch(':id/default')
  async setDefaultAddress(@Req() req: Request, @Param('id') addressId: string): Promise<TAddressResponse> {
    return this.addressService.setDefaultAddress(req.user!.sub, addressId);
  }

  @Delete(':id')
  async deleteAddress(@Req() req: Request, @Param('id') addressId: string): Promise<void> {
    return this.addressService.deleteAddress(req.user!.sub, addressId);
  }
}