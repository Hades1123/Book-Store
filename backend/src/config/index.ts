import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import externalConfig from './external.config';
import jwtConfig from './jwt.config';

export type AppConfig = ConfigType<typeof appConfig>;
export type DatabaseConfig = ConfigType<typeof databaseConfig>;
export type ExternalConfig = ConfigType<typeof externalConfig>;
export type JwtConfig = ConfigType<typeof jwtConfig>;

export { appConfig, databaseConfig, externalConfig, jwtConfig };
