import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async findAll() {
    return this.courseRepo.find({ relations: ['commissions'] });
  }

  async findOne(id: number) {
    // 🚨 Bloquea IDs inválidos antes de llegar al query
    if (!id || isNaN(id)) {
      console.warn('⚠️ findOne() llamado con ID inválido:', id);
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['commissions'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async create(courseData: Partial<Course>) {
    const course = this.courseRepo.create(courseData);
    return this.courseRepo.save(course);
  }
}
