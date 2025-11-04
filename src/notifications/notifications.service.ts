import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notifications.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async getLatest(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getUnread(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.notificationRepo.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateNotificationDto) {
  const { userId, title, message, type } = dto;

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const notification: Partial<Notification> = {
    user,
    title,
    message,
    type,
    isRead: false, // ✅ nombre correcto según tu entidad
  };

  return this.notificationRepo.save(notification);
}




  async markAsRead(notificationId: string) {
    const notif = await this.notificationRepo.findOne({ where: { id: notificationId } });
    if (!notif) throw new NotFoundException('Notification not found');

    notif.isRead = true;
    return this.notificationRepo.save(notif);
  }
}
