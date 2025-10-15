import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Grade } from './entities/grade.entity';

@Injectable()
export class AcademicHistoryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  async getAcademicHistory(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'enrollments',
        'enrollments.course',
        'enrollments.course.enrollments',
      ],
    });

    const grades = await this.gradeRepository.find({
      relations: ['enrollment', 'enrollment.course'],
    });

    return {
      degreeName: 'Licenciatura en Tecnología de la Información',
      degreeCode: 'UADE-LTI',
      courses: grades.map((g) => ({
        courseId: g.enrollment.course.id,
        commissionId: g.enrollment.id,
        semester: g.semester,
        year: g.year,
        finalNote: g.finalNote,
        status: g.status,
      })),
    };
  }
}
