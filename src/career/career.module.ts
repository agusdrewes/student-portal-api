import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { Course } from '../courses/entities/course.entity';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Career, Course])],
  providers: [CareerService],
  controllers: [CareerController],
  exports: [TypeOrmModule, CareerService],
})
export class CareerModule {}
