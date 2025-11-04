import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

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

  @Get(':commissionId/:userId')
  getUserAttendance(
    @Param('userId') userId: string,
    @Param('commissionId') commissionId: string,
  ) {
    return this.attendanceService.getUserAttendance(userId, commissionId);
  }

  @Get(':commissionId')
  getCommissionAttendance(@Param('commissionId') commissionId: string) {
    return this.attendanceService.getCommissionAttendance(commissionId);
  }
}
