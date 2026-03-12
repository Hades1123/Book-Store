import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig, jwtConfig } from 'src/config';
import { StringValue } from 'ms';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: JwtConfig) => ({
        secret: config.jwtAccessSecret,
        signOptions: {
          expiresIn: config.jwtAcessExpire as StringValue,
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
