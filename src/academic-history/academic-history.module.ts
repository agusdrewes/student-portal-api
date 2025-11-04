import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicHistory } from './entities/academic-history.entity';
import { AcademicHistoryService } from './academic-history.service';
import { AcademicHistoryController } from './academic-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicHistory])],
  controllers: [AcademicHistoryController],
  providers: [AcademicHistoryService],
})
export class AcademicHistoryModule { }
