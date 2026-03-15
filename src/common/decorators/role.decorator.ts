import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export const ROLES_KEY = 'ROLE_KEY';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
