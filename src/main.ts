import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', { infer: true }) ?? 8000;

  app.setGlobalPrefix(configService.get<string>('app.apiPrefix') ?? 'default');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
