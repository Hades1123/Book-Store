import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TAllUsersRes } from './types/user-response.type';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { User } from 'src/generated/prisma/client';
import { RoleDto } from './dto/role.dto';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getAllUsers(@Query() query: PaginationDto): Promise<TAllUsersRes> {
    return this.userService.getAllUsers(query);
  }

  @Get('users/:id')
  async getuserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Patch('user/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: RoleDto): Promise<void> {}
}
