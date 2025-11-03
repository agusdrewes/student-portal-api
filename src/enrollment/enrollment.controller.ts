import { Controller, Post, Delete, Param, Body, Get, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments') // 🚨 cambiamos la base
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Inscribirse a una comisión
  @Post(':courseId/commissions/:commissionId')
  enroll(
    @Param('courseId') courseId: string,
    @Param('commissionId') commissionId: string,
    @Body('userId') userId: string,
  ) {
    return this.enrollmentsService.enroll({ userId, courseId, commissionId });
  }

  // Darse de baja
  @Delete(':courseId/commissions/:commissionId')
  withdraw(
    @Param('courseId') courseId: string,
    @Param('commissionId') commissionId: string,
    @Body('userId') userId: string,
  ) {
    return this.enrollmentsService.withdraw(userId, commissionId);
  }

  // Ver todas las inscripciones
  @Get()
  getUserEnrollments(@Query('userId') userId: string) {
    return this.enrollmentsService.findByUser(userId);
  }

  // Ver detalle de una inscripción
  @Get(':commissionId')
  getEnrollmentDetail(
    @Param('commissionId') commissionId: string,
    @Query('userId') userId: string,
  ) {
    return this.enrollmentsService.findEnrollmentDetail(userId, commissionId);
  }
}
