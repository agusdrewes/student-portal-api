import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';

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

  @UseGuards(JwtDecodeGuard)
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
