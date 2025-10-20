import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { AcademicHistoryService } from './academic-history.service';

@Controller('academic-history')
export class AcademicHistoryController {
  constructor(private readonly academicHistoryService: AcademicHistoryService) {}

  // ✅ Ver historial completo de un alumno
  @Get(':userId')
  getUserHistory(@Param('userId') userId: number) {
    return this.academicHistoryService.getUserHistory(userId);
  }

  // ✅ Actualizar nota final y estado (aprobado/desaprobado)
  @Patch(':userId/courses/:courseId')
  updateGrade(
    @Param('userId') userId: number,
    @Param('courseId') courseId: number,
    @Body() body: { finalNote: string; status: 'passed' | 'failed' },
  ) {
    return this.academicHistoryService.updateGrade(userId, courseId, body);
  }
}
