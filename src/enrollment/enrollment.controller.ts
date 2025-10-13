import { Controller, Post, Delete, Param, Body, Get, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('courses/:courseId/commissions/:commissionId')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @Post('enroll')
  enroll(
    @Param('courseId') courseId: number,
    @Param('commissionId') commissionId: number,
    @Body('userId') userId: number,
  ) {
    return this.enrollmentsService.enroll({ userId, courseId, commissionId });
  }

  @Delete('enroll')
  withdraw(
    @Param('courseId') courseId: number,
    @Param('commissionId') commissionId: number,
    @Body('userId') userId: number,
  ) {
    return this.enrollmentsService.withdraw(userId, commissionId);
  }
}
