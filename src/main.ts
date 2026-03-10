import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', { infer: true }) ?? 8000;

  app.setGlobalPrefix(configService.get<string>('app.apiPrefix') ?? 'default');
  await app.listen(port);
}
bootstrap();
