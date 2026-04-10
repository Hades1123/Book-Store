import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddressException } from 'src/common/exceptions/address.exception';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { TAddressResponse } from './types';

const MAX_ADDRESSES_PER_USER = 3;

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAddresses(userId: string): Promise<TAddressResponse[]> {
    const addresses = await this.prismaService.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return addresses.map((address) => ({
      id: address.id,
      receiverName: address.receiverName,
      phone: address.phone,
      province: address.province,
      ward: address.ward,
      detailAddress: address.detailAddress,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }));
  }

  async createAddress(userId: string, dto: CreateAddressDto): Promise<TAddressResponse> {
    // Check max addresses limit
    const count = await this.prismaService.address.count({
      where: { userId },
    });
    if (count >= MAX_ADDRESSES_PER_USER) {
      throw AddressException.limitReached();
    }

    // If first address or dto.isDefault is true, unset other defaults
    const shouldSetDefault = dto.isDefault || count === 0;
    if (shouldSetDefault) {
      await this.prismaService.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await this.prismaService.address.create({
      data: {
        userId,
        receiverName: dto.receiverName,
        phone: dto.phone,
        province: dto.province,
        ward: dto.ward,
        detailAddress: dto.detailAddress,
        isDefault: shouldSetDefault,
      },
    });

    return {
      id: address.id,
      receiverName: address.receiverName,
      phone: address.phone,
      province: address.province,
      ward: address.ward,
      detailAddress: address.detailAddress,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<TAddressResponse> {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw AddressException.notFound();
    }

    // If setting isDefault, unset other defaults first
    if (dto.isDefault) {
      await this.prismaService.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const updated = await this.prismaService.address.update({
      where: { id: addressId },
      data: {
        receiverName: dto.receiverName,
        phone: dto.phone,
        province: dto.province,
        ward: dto.ward,
        detailAddress: dto.detailAddress,
        isDefault: dto.isDefault,
      },
    });

    return {
      id: updated.id,
      receiverName: updated.receiverName,
      phone: updated.phone,
      province: updated.province,
      ward: updated.ward,
      detailAddress: updated.detailAddress,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<TAddressResponse> {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw AddressException.notFound();
    }

    // Unset other defaults
    await this.prismaService.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    const updated = await this.prismaService.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return {
      id: updated.id,
      receiverName: updated.receiverName,
      phone: updated.phone,
      province: updated.province,
      ward: updated.ward,
      detailAddress: updated.detailAddress,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw AddressException.notFound();
    }

    await this.prismaService.address.delete({
      where: { id: addressId },
    });
  }
}