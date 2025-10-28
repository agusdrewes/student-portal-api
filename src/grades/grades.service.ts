import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Commission } from '../commission/entities/commission.entity';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Commission)
        private readonly commissionRepo: Repository<Commission>,
    ) { }

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

    // 🧩 Actualizar notas de un alumno en una comisión
    async updateGrade(userId: number, commissionId: number, dto: UpdateGradeDto) {
        const grade = await this.gradeRepo.findOne({
            where: { user: { id: userId }, commission: { id: commissionId } },
            relations: ['user', 'commission'],
        });

        if (!grade) throw new NotFoundException('Grade record not found');

        Object.assign(grade, dto);

        // 🧠 Lógica automática de aprobación
        if (grade.finalExam && grade.finalExam >= 6) {
            grade.status = 'passed';
        } else if (grade.finalExam && grade.finalExam < 6) {
            grade.status = 'failed';
        }

        return this.gradeRepo.save(grade);
    }
}
