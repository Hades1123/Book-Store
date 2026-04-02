import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { appConfig, databaseConfig, externalConfig, jwtConfig } from './config/index';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/upload/upload.module';
import { BookModule } from './modules/book/book.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, externalConfig, jwtConfig],
      validate,
      cache: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    UploadModule,
    BookModule,
    CategoryModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
