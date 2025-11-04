import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { AcademicHistoryService } from './academic-history.service';

@Controller('academic-history')
export class AcademicHistoryController {
  constructor(private readonly academicHistoryService: AcademicHistoryService) {}

  @Get(':userId')
  getUserHistory(@Param('userId') userId: string) {
    return this.academicHistoryService.getUserHistory(userId);
  }

  @Patch(':userId/courses/:courseId')
  updateGrade(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() body: { finalNote: string; status: 'passed' | 'failed' },
  ) {
    return this.academicHistoryService.updateGrade(userId, courseId, body);
  }
}
