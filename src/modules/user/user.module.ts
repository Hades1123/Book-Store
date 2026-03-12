import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthCoreModule } from 'src/modules/auth/auth-core.module';

@Module({
  imports: [AuthCoreModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
