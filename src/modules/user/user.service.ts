import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUserProfile(req: any) {
    return req.user;
  }
}
