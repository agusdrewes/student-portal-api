import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Obtener las últimas 10 notificaciones
  async getLatest(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  // ✅ Obtener solo las no leídas
  async getUnread(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.notificationRepo.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Crear notificación (puede usarse desde otros servicios)
  async create(userId: number, title: string, message: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const notification = this.notificationRepo.create({
      user,
      title,
      message,
    });
    return this.notificationRepo.save(notification);
  }

  // ✅ Marcar como leída
  async markAsRead(notificationId: number) {
    const notif = await this.notificationRepo.findOne({ where: { id: notificationId } });
    if (!notif) throw new NotFoundException('Notification not found');

    notif.isRead = true;
    return this.notificationRepo.save(notif);
  }
}
