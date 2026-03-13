import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthCoreModule } from 'src/modules/auth/auth-core.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [AuthCoreModule, PrismaModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
