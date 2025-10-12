import { Module } from '@nestjs/common';
import { CalendarController } from './controller/calendar.controller';
import { CalendarService } from './service/calendar.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
