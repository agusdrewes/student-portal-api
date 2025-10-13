import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module'; 
import { CoursesModule } from './courses/courses.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CalendarModule } from './calendar/calendar.module';
import { AcademicHistoryModule } from './academic-history/academic-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule, 
    CoursesModule,
    EnrollmentModule,
    CalendarModule,
    AcademicHistoryModule
  ],
})
export class AppModule {}
