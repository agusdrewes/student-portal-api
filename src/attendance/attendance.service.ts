import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user/entities/user.entity';
import { Commission } from '../commission/entities/commission.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
  ) {}

  // ✅ Registrar asistencia
  async markAttendance(userId: number, commissionId: number, present: boolean, date?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const commission = await this.commissionRepo.findOne({ where: { id: commissionId } });

    if (!user || !commission) {
      throw new NotFoundException('User or commission not found');
    }

    const attendanceDate = date || new Date().toISOString().split('T')[0];

    let attendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, commission: { id: commissionId }, date: attendanceDate },
    });

    if (attendance) {
      attendance.present = present;
    } else {
      attendance = this.attendanceRepo.create({
        user,
        commission,
        date: attendanceDate,
        present,
      });
    }

    return this.attendanceRepo.save(attendance);
  }

  // ✅ Obtener asistencias de un alumno en una comisión
  async getUserAttendance(userId: number, commissionId: number) {
    return this.attendanceRepo.find({
      where: { user: { id: userId }, commission: { id: commissionId } },
      order: { date: 'ASC' },
    });
  }

  // ✅ Obtener asistencia general de una comisión
  async getCommissionAttendance(commissionId: number) {
    return this.attendanceRepo.find({
      where: { commission: { id: commissionId } },
      relations: ['user'],
      order: { date: 'ASC' },
    });
  }
}
