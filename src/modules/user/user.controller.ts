import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { type Request } from 'express';
import { AppException } from 'src/common/exceptions/app.exception';
import { TUserResponse } from './types/user-response.type';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(@Req() req: Request): Promise<TUserResponse> {
    if (!req.user) {
      throw AppException.userNotFound();
    }
    return this.userService.getUserProfile(req.user.sub);
  }

  @Patch()
  async updateUserProfile(@Req() res: Request, @Body() body: any) {}
}
