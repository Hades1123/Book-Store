import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig, jwtConfig } from 'src/config';
import { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: JwtConfig) => ({
        secret: config.jwtAccessSecret,
        signOptions: {
          expiresIn: config.jwtAccessExpire as StringValue,
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class AuthCoreModule {}
