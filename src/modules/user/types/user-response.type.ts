import { User } from 'src/generated/prisma/client';

export type TUserResponse = Pick<User, 'fullName' | 'email' | 'phone' | 'avatarPublicId'>;
export type TUserUpdateProfileResponse = Pick<User, 'fullName' | 'phone' | 'avatarPublicId'>;
export type TAllUsersRes = {
  user: TUserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
