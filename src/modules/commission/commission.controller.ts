import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';

@Controller('courses/:courseId/commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  findByCourse(@Param('courseId') courseId: number) {
    return this.commissionService.findByCourse(courseId);
  }

  @Post()
  create(@Param('courseId') courseId: number, @Body() dto: CreateCommissionDto) {
    return this.commissionService.create(courseId, dto);
  }
}
