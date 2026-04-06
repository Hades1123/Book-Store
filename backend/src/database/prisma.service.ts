import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import databaseConfig from 'src/config/database.config';
import { type DatabaseConfig } from 'src/config/index';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(@Inject(databaseConfig.KEY) private dbConfig: DatabaseConfig) {
    const adapter = new PrismaPg(
      {
        connectionString: dbConfig.databaseUrl,
      },
      { schema: dbConfig.databaseUrl.split('=')[1] },
    );
    super({ adapter });
  }
}
