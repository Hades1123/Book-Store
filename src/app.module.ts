import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { appConfig, databaseConfig } from './config/index';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate,
      cache: true,
    }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
