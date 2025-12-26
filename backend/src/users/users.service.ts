import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResolverDto } from './dto/create-resolver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createResolver(createResolverDto: CreateResolverDto) {
    const { name, email, password } = createResolverDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create resolver
    const resolver = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'RESOLVER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return resolver;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getResolvers() {
    return this.prisma.user.findMany({
      where: {
        role: 'RESOLVER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
