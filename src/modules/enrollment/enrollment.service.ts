import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

    if (!user || !course || !commission) {
      throw new NotFoundException('Invalid enrollment data');
    }

    if (commission.availableSpots <= 0) {
      throw new BadRequestException('No available spots');
    }

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

  // ✅ Ver todos los cursos/comisiones de un usuario
  async findByUser(userId: number) {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const enrollments = await this.enrollmentRepo.find({
      where: { user: { id: userId } },
      relations: ['course', 'commission'],
    });

    if (!enrollments.length) {
      throw new NotFoundException('No enrollments found for this user');
    }

    return enrollments.map((enr) => ({
      enrollmentId: enr.id,
      course: enr.course
        ? {
            id: enr.course.id,
            name: enr.course.name,
            code: enr.course.code,
          }
        : { id: null, name: 'Sin curso asignado' },
      commission: enr.commission
        ? {
            id: enr.commission.id,
            professorName: enr.commission.professorName,
            shift: enr.commission.shift,
            days: enr.commission.days,
            startTime: enr.commission.startTime,
            endTime: enr.commission.endTime,
          }
        : { id: null, professorName: 'Sin comisión asignada' },
    }));
  }

  // ✅ Ver detalle de una inscripción específica
  async findEnrollmentDetail(userId: number, commissionId: number) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId } },
      relations: ['course', 'commission'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return {
      id: enrollment.id,
      course: enrollment.course
        ? { id: enrollment.course.id, name: enrollment.course.name }
        : null,
      commission: enrollment.commission
        ? {
            id: enrollment.commission.id,
            professorName: enrollment.commission.professorName,
            days: enrollment.commission.days,
            shift: enrollment.commission.shift,
          }
        : null,
    };
  }
}
