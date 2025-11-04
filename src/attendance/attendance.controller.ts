import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ✅ Registrar asistencia (POST)
  @Post(':commissionId/:userId')
  markAttendance(
    @Param('userId') userId: string,
    @Param('commissionId') commissionId: string,
    @Body() body: { present: boolean; date?: string },
  ) {
    return this.attendanceService.markAttendance(
      userId,
      commissionId,
      body.present,
      body.date,
    );
  }

  // ✅ Obtener asistencias de un usuario en una comisión
  @Get(':commissionId/:userId')
  getUserAttendance(
    @Param('userId') userId: string,
    @Param('commissionId') commissionId: string,
  ) {
    return this.attendanceService.getUserAttendance(userId, commissionId);
  }

  // ✅ Obtener todas las asistencias de una comisión
  @Get(':commissionId')
  getCommissionAttendance(@Param('commissionId') commissionId: string) {
    return this.attendanceService.getCommissionAttendance(commissionId);
  }
}
