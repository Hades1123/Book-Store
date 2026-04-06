import { User } from 'src/generated/prisma/client';

export type TUserResponse = Pick<User, 'id' | 'fullName' | 'email' | 'phone' | 'avatarPublicId' | 'role'>;
export type TAllUsersRes = {
  user: TUserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
