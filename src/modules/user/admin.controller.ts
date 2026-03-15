import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TAllUsersRes } from './types/user-response.type';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getAllUsers(@Query() query: PaginationDto): Promise<TAllUsersRes> {
    return this.userService.getAllUsers(query);
  }
}
