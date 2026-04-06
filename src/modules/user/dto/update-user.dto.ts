import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/generated/prisma/client';

export class UpdateUserDto implements Partial<User> {
  @IsString()
  @IsOptional()
  fullName?: string | undefined;

  @IsString()
  @IsOptional()
  phone?: string | undefined;

  @IsString()
  @IsOptional()
  avatarPublicId?: string | undefined;
}
