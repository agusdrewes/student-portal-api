import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicHistoryController } from './academic-history.controller';
import { AcademicHistoryService } from './academic-history.service';
import { User } from '../user/entities/user.entity';
import { Grade } from './entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grade])],
  controllers: [AcademicHistoryController],
  providers: [AcademicHistoryService],
})
export class AcademicHistoryModule {}
