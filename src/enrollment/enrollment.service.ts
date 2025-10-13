import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';


@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async enroll(dto: CreateEnrollmentDto) {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    const course = await this.courseRepository.findOneBy({ id: dto.courseId });

    if (!user || !course) {
      throw new Error('Usuario o curso no encontrado');
    }

    const enrollment = this.enrollmentRepository.create({ user, course });
    return this.enrollmentRepository.save(enrollment);
  }

  findAll() {
    return this.enrollmentRepository.find({
      relations: ['user', 'course'],
    });
  }
}
