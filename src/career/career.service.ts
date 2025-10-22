import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepo: Repository<Career>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findAll() {
    return this.careerRepo.find({ relations: ['courses'] });
  }

  async findOne(id: number) {
    const career = await this.careerRepo.findOne({ where: { id }, relations: ['courses'] });
    if (!career) throw new NotFoundException(`Career with ID ${id} not found`);
    return career;
  }

  async create(data: Partial<Career>) {
    const career = this.careerRepo.create(data);
    return this.careerRepo.save(career);
  }

  async addCourse(careerId: number, courseId: number) {
    const career = await this.careerRepo.findOne({ where: { id: careerId }, relations: ['courses'] });
    const course = await this.courseRepo.findOne({ where: { id: courseId } });

    if (!career || !course) throw new NotFoundException('Career or Course not found');

    course.career = career;
    await this.courseRepo.save(course);

    return { message: `Course ${course.name} added to ${career.name}` };
  }
}
