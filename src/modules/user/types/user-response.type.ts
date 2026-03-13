import { User } from 'src/generated/prisma/client';

export type TUserResponse = Pick<User, 'fullName' | 'email' | 'phone' | 'avatarPublicId'>;
export type TUserUpdateProfileResponse = Pick<User, 'fullName' | 'phone' | 'avatarPublicId'>;
