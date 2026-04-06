import { Request } from 'express';

export type TPayload = {
  sub: string;
  email: string;
  role: string;
};
