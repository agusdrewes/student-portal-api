import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { User } from '../user/entities/user.entity';
import { Commission } from '../commission/entities/commission.entity';
import { Grade } from './entities/grade.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Grade, User, Commission])],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService], // ✅ para que pueda usarse desde Enrollments
})
export class GradesModule {}
