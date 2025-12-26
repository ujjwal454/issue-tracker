import { Controller, Get, Post, Delete, Body, Param, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateResolverDto } from './dto/create-resolver.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createResolver(@Body() createResolverDto: CreateResolverDto, @Request() req: any) {
    // Check if user is ADMIN
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can create resolvers');
    }
    return this.usersService.createResolver(createResolverDto);
  }

  @Get()
  async getAllUsers(@Request() req: any) {
    // Check if user is ADMIN
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can view all users');
    }
    return this.usersService.getAllUsers();
  }

  @Get('resolvers')
  async getResolvers(@Request() req: any) {
    // Check if user is ADMIN
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can view resolvers');
    }
    return this.usersService.getResolvers();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    // Check if user is ADMIN
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can delete users');
    }
    return this.usersService.deleteUser(id);
  }
}
