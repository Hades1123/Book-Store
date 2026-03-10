import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello world';
  }

  async createUser() {
    return await this.prismaService.user.create({
      data: {
        email: 'seller@gmail.com',
        avatarUrl: '',
        fullName: 'Van Si',
        phone: '0987249005',
        role: 'ADMIN',
      },
    });
  }
}
