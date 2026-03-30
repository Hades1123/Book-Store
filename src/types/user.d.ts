export type TRole = 'CUSTOMER' | 'ADMIN';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarPublicId: string;
  role: TRole;
}
