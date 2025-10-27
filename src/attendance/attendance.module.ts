import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { User } from '../user/entities/user.entity';
import { Commission } from '../commission/entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, User, Commission])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
