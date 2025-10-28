import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { GradesService } from './grades.service';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.gradesService.findByUser(userId);
  }

  @Get('user/:userId/commission/:commissionId')
  findByUserAndCommission(
    @Param('userId') userId: number,
    @Param('commissionId') commissionId: number,
  ) {
    return this.gradesService.findByUserAndCommission(userId, commissionId);
  }

  @Patch('user/:userId/commission/:commissionId')
  updateGrade(
    @Param('userId') userId: number,
    @Param('commissionId') commissionId: number,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.gradesService.updateGrade(userId, commissionId, dto);
  }
}
