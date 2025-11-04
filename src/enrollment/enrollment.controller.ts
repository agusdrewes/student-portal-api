import { Controller, Post, Delete, Param, Body, Get, Query, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @UseGuards(JwtDecodeGuard)
  @Post(':courseId/commissions/:commissionId')
  enroll(
    @Param('courseId') courseId: string,
    @Param('commissionId') commissionId: string,
    @Body('userId') userId: string,
  ) {
    return this.enrollmentsService.enroll({ userId, courseId, commissionId });
  }

  @UseGuards(JwtDecodeGuard)
  @Delete(':courseId/commissions/:commissionId')
  withdraw(
    @Param('courseId') courseId: string,
    @Param('commissionId') commissionId: string,
    @Body('userId') userId: string,
  ) {
    return this.enrollmentsService.withdraw(userId, commissionId);
  }

  @UseGuards(JwtDecodeGuard)
  @Get()
  getUserEnrollments(@Query('userId') userId: string) {
    return this.enrollmentsService.findByUser(userId);
  }

  @UseGuards(JwtDecodeGuard)
  @Get(':commissionId')
  getEnrollmentDetail(
    @Param('commissionId') commissionId: string,
    @Query('userId') userId: string,
  ) {
    return this.enrollmentsService.findEnrollmentDetail(userId, commissionId);
  }
}
