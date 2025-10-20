import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './modules/config/typeorm.config';
import { UserModule } from './modules/user/user.module'; 
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollment/enrollment.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AcademicHistoryModule } from './modules/academic-history/academic-history.module';
import { AccountModule } from './modules/account/account.module';
import { CommissionModule } from './modules/commission/commission.module';

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
    AccountModule
  ],
})
export class AppModule {}
