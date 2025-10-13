import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Commission } from '../commission/entities/commission.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Commission)
    private commissionRepo: Repository<Commission>,
  ) {}

  async enroll(dto: CreateEnrollmentDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    const commission = await this.commissionRepo.findOne({ where: { id: dto.commissionId } });

    if (!user || !course || !commission) throw new NotFoundException('Invalid data');

    // validar si hay cupos
    if (commission.availableSpots <= 0) {
      throw new BadRequestException('No available spots');
    }

    // crear inscripción
    const enrollment = this.enrollmentRepo.create({ user, course, commission });
    commission.availableSpots -= 1;
    await this.commissionRepo.save(commission);
    return this.enrollmentRepo.save(enrollment);
  }

  async withdraw(userId: number, commissionId: number) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId } },
      relations: ['commission'],
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    enrollment.commission.availableSpots += 1;
    await this.commissionRepo.save(enrollment.commission);
    await this.enrollmentRepo.remove(enrollment);
    return { message: 'Successfully withdrawn' };
  }


}
