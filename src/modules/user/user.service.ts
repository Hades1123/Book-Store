import { Injectable } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { PrismaService } from 'src/database/prisma.service';
import { TUserResponse } from './types/user-response.type';

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
}
