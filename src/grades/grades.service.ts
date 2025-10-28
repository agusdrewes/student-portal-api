import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Commission } from '../commission/entities/commission.entity';
import { Grade } from './entities/grade.entity';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { AcademicHistory } from '../academic-history/entities/academic-history.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepo: Repository<Grade>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,

    @InjectRepository(AcademicHistory)
    private readonly historyRepo: Repository<AcademicHistory>,
  ) {}

  // 🧩 Crear registro inicial (cuando un alumno se inscribe)
  async createInitial(userId: number, commissionId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const commission = await this.commissionRepo.findOne({ where: { id: commissionId } });

    if (!user || !commission) throw new NotFoundException('User or commission not found');

    const grade = new Grade();
    grade.user = user;
    grade.commission = commission;
    grade.firstExam = 0;
    grade.secondExam = 0;
    grade.finalExam = 0;
    grade.status = 'in_progress';

    return this.gradeRepo.save(grade);
  }

  // 🧩 Obtener todas las calificaciones de un alumno
  async findByUser(userId: number) {
    const grades = await this.gradeRepo.find({
      where: { user: { id: userId } },
      relations: ['commission'],
    });
    if (!grades.length) throw new NotFoundException('No grades found for this user');
    return grades;
  }

  // 🧩 Actualizar notas y reflejar en historial académico
  async updateGrade(userId: number, commissionId: number, dto: UpdateGradeDto) {
    const grade = await this.gradeRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId } },
      relations: ['user', 'commission'],
    });

    if (!grade) throw new NotFoundException('Grade record not found');

    Object.assign(grade, dto);

    // 🧠 Lógica automática de aprobación
    if (grade.finalExam !== null && grade.finalExam !== undefined) {
      if (grade.finalExam >= 4) {
        grade.status = 'passed';
      } else {
        grade.status = 'failed';
      }

      // 🧩 Actualizar el historial académico correspondiente
      await this.historyRepo.update(
        {
          user: { id: userId },
          commission: { id: commissionId },
        },
        { status: grade.status,
            finalNote: grade.finalExam?.toString() ?? null,
         },
      );
    }

    return this.gradeRepo.save(grade);
  }

  // 🧩 Obtener notas de un alumno en una comisión específica
  async findByUserAndCommission(userId: number, commissionId: number) {
    const grade = await this.gradeRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId } },
      relations: ['commission'],
    });

    if (!grade)
      throw new NotFoundException('No grade record found for this user in the specified commission');

    return {
      commission: {
        id: grade.commission.id,
        professor: grade.commission.professorName,
        shift: grade.commission.shift,
        days: grade.commission.days,
      },
      firstExam: grade.firstExam,
      secondExam: grade.secondExam,
      finalExam: grade.finalExam,
      status: grade.status,
    };
  }
}
