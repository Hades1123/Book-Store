import { IsEnum } from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class RoleDto {
  @IsEnum(Role)
  role: Role;
}
