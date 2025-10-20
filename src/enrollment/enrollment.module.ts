import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentsService } from './enrollment.service';
import { EnrollmentsController } from './enrollment.controller';
import { User } from '../user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Commission } from '../commission/entities/commission.entity';
import { AcademicHistory } from '../academic-history/entities/academic-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course, Commission, AcademicHistory])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
