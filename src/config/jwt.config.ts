import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  () =>
    ({
      jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
      jwtAccessExpire: process.env.JWT_ACCESS_EXPIRES_IN as string,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
      jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRES_IN as string,
    }) as const,
);
