import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { type Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(@Req() req: Request) {
    return req.user;
  }

  @Post()
  @Public()
  async test() {
    console.log('hello');
  }
}
