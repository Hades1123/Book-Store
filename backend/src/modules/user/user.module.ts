import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/database/prisma.service';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController, AdminController],
})
export class UserModule {}
