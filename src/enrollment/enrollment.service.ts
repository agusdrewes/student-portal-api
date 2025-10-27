import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Commission } from '../commission/entities/commission.entity';
import { AcademicHistory } from '../academic-history/entities/academic-history.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { start } from 'repl';

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
    @InjectRepository(AcademicHistory)
    private historyRepo: Repository<AcademicHistory>, // ✅ agregado
  ) { }

  async enroll(dto: CreateEnrollmentDto) {
    const { userId, courseId, commissionId } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    const commission = await this.commissionRepo.findOne({ where: { id: commissionId } });

    if (!user || !course || !commission) {
      throw new NotFoundException('Invalid enrollment data');
    }

    // 🧩 1️⃣ Validar correlativas
    if (course.correlates && course.correlates.length > 0) {
      // Buscar el historial académico del usuario para esas correlativas
      const histories = await this.historyRepo.find({
        where: {
          user: { id: userId },
          course: { id: In(course.correlates) },
        },
        relations: ['course'],
      });

      // Obtener IDs de correlativas aprobadas
      const approvedIds = histories
        .filter((h) => h.status === 'passed')
        .map((h) => h.course.id);

      // Ver cuáles faltan aprobar
      const missing = course.correlates.filter((id) => !approvedIds.includes(id));

      if (missing.length > 0) {
        const missingCourses = await this.courseRepo.find({
          where: { id: In(missing) },
        });

        const missingNames = missingCourses.map((c) => c.name).join(', ');
        throw new ForbiddenException(
          `Cannot enroll in ${course.name}. Missing prerequisites: ${missingNames}`,
        );
      }
    }

    // 🧩 2️⃣ Validar cupos
    if (commission.availableSpots <= 0) {
      throw new BadRequestException('No available spots');
    }

    // 🧩 3️⃣ Evitar doble inscripción
    const existingEnrollment = await this.enrollmentRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (existingEnrollment) {
      throw new BadRequestException('User already enrolled in this course');
    }

    // 🧩 4️⃣ Crear inscripción
    const enrollment = this.enrollmentRepo.create({ user, course, commission });
    commission.availableSpots -= 1;
    await this.commissionRepo.save(commission);
    await this.enrollmentRepo.save(enrollment);

    // 🧩 5️⃣ Crear historial académico inicial
    const currentYear = new Date().getFullYear().toString();
    const currentSemester = new Date().getMonth() < 6 ? '1C' : '2C';

    const history = this.historyRepo.create({
      user,
      course,
      commission,
      semester: currentSemester,
      year: currentYear,
      status: 'in_progress',
      finalNote: null,
    });
    await this.historyRepo.save(history);

    return {
      message: 'Enrollment successful and academic history record created',
      enrollment: {
        id: enrollment.id,
        course: {
          id: course.id,
          code: course.code,
          name: course.name,
        },
        commission: {
          id: commission.id,
          days: commission.days,
          shift: commission.shift,
          professorName: commission.professorName,
        },
      },
      academicHistory: {
        semester: history.semester,
        year: history.year,
        finalNote: history.finalNote,
        status: history.status,
      },
    }
  }


  // ✅ Retirarse de una comisión (y borrar el registro de historial si sigue en progreso)
  async withdraw(userId: number, commissionId: number) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId } },
      relations: ['commission', 'course'],
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    enrollment.commission.availableSpots += 1;
    await this.commissionRepo.save(enrollment.commission);

    // Borrar historial académico si todavía está "in_progress"
    await this.historyRepo.delete({
      user: { id: userId },
      course: { id: enrollment.course.id },
      status: 'in_progress',
    });

    await this.enrollmentRepo.remove(enrollment);
    return { message: 'Successfully withdrawn and academic history removed' };
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
          classroom: enr.commission.classRoom
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
          startTime: enrollment.commission.startTime,
          endTime: enrollment.commission.endTime,
          classroom: enrollment.commission.classRoom
        }
        : null,
    };
  }
}
