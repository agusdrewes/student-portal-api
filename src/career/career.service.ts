import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  ) { }

  async findAll() {
    return this.careerRepo.find({ relations: ['courses'] });
  }

  async findOne(id: string) {
    const career = await this.careerRepo.findOne({ where: { id }, relations: ['courses'] });
    if (!career) throw new NotFoundException(`Career with ID ${id} not found`);
    return career;
  }

  async create(data: Partial<Career>) {
    const career = this.careerRepo.create(data);
    return this.careerRepo.save(career);
  }

  async addCourse(careerId: string, courseId: string) {
    const career = await this.careerRepo.findOne({ where: { id: careerId }, relations: ['courses'] });
    const course = await this.courseRepo.findOne({ where: { id: courseId } });

    if (!career || !course) throw new NotFoundException('Career or Course not found');

    const alreadyExists = career.courses.some((c) => c.id === course.id);
    if (alreadyExists) {
      throw new BadRequestException('Course already assigned to this career');
    }

    career.courses.push(course);
    await this.careerRepo.save(career);

    return { message: `Course ${course.name} added to ${career.name}` };
  }
}
