import { ConfigType } from '@nestjs/config';
import appConfig from './app.config.js';
import databaseConfig from './database.config.js';

export type AppConfig = ConfigType<typeof appConfig>;
export type DatabaseConfig = ConfigType<typeof databaseConfig>;

export { appConfig, databaseConfig };
