import { Controller, Get, Param } from '@nestjs/common';
import { AcademicHistoryService } from './academic-history.service';

@Controller('academic-history')
export class AcademicHistoryController {
  constructor(private readonly service: AcademicHistoryService) {}

  // Ejemplo: /academic-history/1
  @Get(':userId')
  getHistory(@Param('userId') userId: string) {
    return this.service.getAcademicHistory(Number(userId));
  }
}
