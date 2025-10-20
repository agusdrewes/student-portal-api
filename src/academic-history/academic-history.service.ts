import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicHistory } from './entities/academic-history.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AcademicHistoryService {
  constructor(
    @InjectRepository(AcademicHistory)
    private historyRepo: Repository<AcademicHistory>,
  ) {}

  // ✅ Obtener historial de un usuario
 async getUserHistory(userId: number) {
  const histories = await this.historyRepo.find({
    where: { user: { id: userId } },
    relations: ['user', 'course', 'commission'], // 👈 importante: traemos todo
    order: { year: 'ASC' },
  });

  if (!histories.length) {
    throw new NotFoundException('No academic history found for this user');
  }

  return histories.map((h) => ({
    id: h.id,
    course: h.course
      ? { id: h.course.id, name: h.course.name }
      : { id: null, name: 'Curso no encontrado' },
    commission: h.commission
      ? {
          id: h.commission.id,
          professorName: h.commission.professorName,
          shift: h.commission.shift,
        }
      : { id: null, professorName: 'Comisión no encontrada' },
    semester: h.semester,
    year: h.year,
    status: h.status,
    finalNote: h.finalNote,
  }));
}


  // ✅ Registrar o actualizar una nota final
  async updateGrade(
    userId: number,
    courseId: number,
    data: { finalNote: string; status: 'passed' | 'failed' },
  ) {
    const record = await this.historyRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });

    if (!record) throw new NotFoundException('Enrollment not found in history');

    record.finalNote = data.finalNote;
    record.status = data.status;
    return this.historyRepo.save(record);
  }
}
