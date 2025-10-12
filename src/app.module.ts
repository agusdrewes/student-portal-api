import { Module } from '@nestjs/common';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [CalendarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
