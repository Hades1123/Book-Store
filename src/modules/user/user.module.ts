import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController, AdminController],
})
export class UserModule {}
