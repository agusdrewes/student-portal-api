import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from './entities/commission.entity';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private commissionRepo: Repository<Commission>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async findByCourse(courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    return this.commissionRepo.find({ where: { course: { id: courseId } } });
  }

  async create(courseId: number, dto: CreateCommissionDto) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const commission = this.commissionRepo.create({ ...dto, course });
    return this.commissionRepo.save(commission);
  }
}
