import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { AuthCoreModule } from './auth-core.module';

@Module({
  imports: [PrismaModule, MailModule, AuthCoreModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
