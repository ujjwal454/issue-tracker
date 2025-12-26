import { Controller, Get, Post, Patch, Body, Param, Request, ForbiddenException } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { AssignComplaintDto } from './dto/assign-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  async create(@Body() createComplaintDto: CreateComplaintDto, @Request() req: any) {
    // Only USER role can create complaints
    if (req.user.role !== 'USER') {
      throw new ForbiddenException('Only users can create complaints');
    }
    return this.complaintsService.create(req.user.userId, createComplaintDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.complaintsService.findAll(req.user.role, req.user.userId);
  }

  @Get('my')
  async getMyComplaints(@Request() req: any) {
    // Only RESOLVER can access this endpoint
    if (req.user.role !== 'RESOLVER') {
      throw new ForbiddenException('Only resolvers can access this endpoint');
    }
    return this.complaintsService.getMyComplaints(req.user.userId);
  }

  @Patch(':id/assign')
  async assign(@Param('id') id: string, @Body() assignComplaintDto: AssignComplaintDto, @Request() req: any) {
    // Only ADMIN can assign complaints
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can assign complaints');
    }
    return this.complaintsService.assign(id, assignComplaintDto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto, @Request() req: any) {
    // Only RESOLVER can update status
    if (req.user.role !== 'RESOLVER') {
      throw new ForbiddenException('Only resolvers can update complaint status');
    }
    return this.complaintsService.updateStatus(id, updateStatusDto, req.user.userId);
  }
}
