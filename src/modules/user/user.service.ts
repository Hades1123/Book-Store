import { Injectable } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/database/prisma.service';
import { TAllUsersRes, TUserResponse } from './types/user-response.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserProfile(id: string): Promise<TUserResponse> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw AppException.userNotFound();
    }
    return {
      fullName: user.fullName,
      email: user.email,
      avatarPublicId: user.avatarPublicId,
      phone: user.phone,
    };
  }

  async updateUserProfile(body: UpdateUserDto, id: string): Promise<TUserResponse> {
    if (!body || Object.keys(body).length === 0) {
      return this.getUserProfile(id);
    }
    const { avatarPublicId, fullName, phone } = body;
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        avatarPublicId,
        fullName,
        phone,
      },
    });
    return {
      avatarPublicId: user.avatarPublicId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
    };
  }

  async getAllUsers(query: PaginationDto): Promise<TAllUsersRes> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const total = await this.prismaService.user.count();
    const users = await this.prismaService.user.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        fullName: 'asc',
      },
    });
    const result: TUserResponse[] = users.map((user) => ({
      fullName: user.fullName,
      avatarPublicId: user.avatarPublicId,
      email: user.email,
      phone: user.phone,
    }));

    return {
      pagination: {
        limit,
        page,
        total,
      },
      user: result,
    };
  }
}
