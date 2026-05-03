import { ForbiddenException, Injectable } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/database/prisma.service';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { TAllUsersRes, TUserResponse } from './types/user-response.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Role, User } from 'src/generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async getUserProfile(id: string): Promise<TUserResponse> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw AppException.userNotFound();
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarPublicId: user.avatarPublicId,
      phone: user.phone,
      role: user.role,
    };
  }

  async updateUserProfile(body: UpdateUserDto, id: string): Promise<TUserResponse> {
    if (!body || Object.keys(body).length === 0) {
      return this.getUserProfile(id);
    }
    const { avatarPublicId, fullName, phone } = body;

    let oldAvatarPublicId: string | null = null;
    if (avatarPublicId) {
      const currentUser = await this.prismaService.user.findUnique({ where: { id } });
      oldAvatarPublicId = currentUser?.avatarPublicId ?? null;
    }

    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        avatarPublicId,
        fullName,
        phone,
      },
    });

    if (
      oldAvatarPublicId &&
      avatarPublicId &&
      oldAvatarPublicId !== avatarPublicId
    ) {
      this.cloudinaryService.deleteFile(oldAvatarPublicId).catch(() => {});
    }

    return {
      id: user.id,
      avatarPublicId: user.avatarPublicId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
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
      id: user.id,
      fullName: user.fullName,
      avatarPublicId: user.avatarPublicId,
      email: user.email,
      phone: user.phone,
      role: user.role,
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

  async getUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw AppException.userNotFound();
    }
    return user;
  }

  async updateUserRole(id: string, role: Role): Promise<void> {
    /**
     * only one super_admin in our system and the number must be = 1
     * number of admin is flexible :D
     */
    // if (role == 'SUPER_ADMIN') {
    //   // const superAdmin = await this.prismaService.user.findUnique({ where: {} });
    //   throw new ForbiddenException('Must be one Super Admin !!!');
    // }
  }
}
