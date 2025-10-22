import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module'; 
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollment/enrollment.module';
import { CalendarModule } from './calendar/calendar.module';
import { AcademicHistoryModule } from './academic-history/academic-history.module';
import { AccountModule } from './account/account.module';
import { CommissionModule } from './commission/commission.module';
import { CareerModule } from './career/career.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule, 
    CoursesModule,
    CommissionModule,
    EnrollmentsModule,
    CalendarModule,
    AcademicHistoryModule, 
    AccountModule,
    CareerModule
  ],
})
export class AppModule {}
