import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { GradesService } from './grades.service';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // Obtener todas las calificaciones de un alumno
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.gradesService.findByUser(userId);
  }

  // Actualizar notas de un alumno en una comisión
  @Patch('user/:userId/commission/:commissionId')
  updateGrade(
    @Param('userId') userId: number,
    @Param('commissionId') commissionId: number,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.gradesService.updateGrade(userId, commissionId, dto);
  }
}
