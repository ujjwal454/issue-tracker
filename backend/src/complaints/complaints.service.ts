import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { AssignComplaintDto } from './dto/assign-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createComplaintDto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: {
        ...createComplaintDto,
        userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userRole: string, userId: string) {
    if (userRole === 'ADMIN') {
      // Admin sees all complaints
      return this.prisma.complaint.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          resolver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (userRole === 'RESOLVER') {
      // Resolver sees assigned complaints
      return this.prisma.complaint.findMany({
        where: {
          resolverId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          resolver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // User sees only their own complaints
      return this.prisma.complaint.findMany({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          resolver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  }

  async getMyComplaints(userId: string) {
    return this.prisma.complaint.findMany({
      where: {
        resolverId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async assign(id: string, assignComplaintDto: AssignComplaintDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    // Verify resolver exists
    const resolver = await this.prisma.user.findUnique({
      where: { id: assignComplaintDto.resolverId },
    });

    if (!resolver || resolver.role !== 'RESOLVER') {
      throw new NotFoundException('Resolver not found');
    }

    return this.prisma.complaint.update({
      where: { id },
      data: {
        resolverId: assignComplaintDto.resolverId,
        status: complaint.status === 'PENDING' ? 'IN_PROGRESS' : complaint.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto, userId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    // Only resolver assigned to this complaint can update status
    if (complaint.resolverId !== userId) {
      throw new ForbiddenException('You are not assigned to this complaint');
    }

    return this.prisma.complaint.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resolver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
