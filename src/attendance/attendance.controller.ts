import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ExternalJwtAuthGuard } from 'src/auth/external-jwt.guard';

@UseGuards(ExternalJwtAuthGuard)
@Controller('commissions/:commissionId/attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ✅ Registrar asistencia de un usuario en una comisión
  @Post(':userId')
  markAttendance(
    @Param('commissionId') commissionId: string,
    @Param('userId') userId: string,
    @Body() body: { present: boolean; date?: string },
  ) {
    return this.attendanceService.markAttendance(
      userId,           // 👈 mismo orden que antes
      commissionId,
      body.present,
      body.date,
    );
  }

  // ✅ Obtener la asistencia de un usuario en una comisión
  @Get(':userId')
  getUserAttendance(
    @Param('commissionId') commissionId: string,
    @Param('userId') userId: string,
  ) {
    return this.attendanceService.getUserAttendance(
      userId,           // 👈 mismo orden que antes
      commissionId,
    );
  }

  // ✅ Obtener todas las asistencias de una comisión
  @Get()
  getCommissionAttendance(@Param('commissionId') commissionId: string) {
    return this.attendanceService.getCommissionAttendance(commissionId);
  }
}
