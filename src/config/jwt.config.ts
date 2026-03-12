import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  () =>
    ({
      jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'MysecreteCodekkk',
      jwtAccessExpire: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'gotosleep',
      jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }) as const,
);
