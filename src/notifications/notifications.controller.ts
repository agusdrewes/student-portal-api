import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('users/:userId/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ✅ Obtener las últimas 10 notificaciones de un usuario
  @Get()
  getLatest(@Param('userId') userId: number) {
    return this.notificationsService.getLatest(userId);
  }

  // ✅ Obtener solo las no leídas
  @Get('unread')
  getUnread(@Param('userId') userId: number) {
    return this.notificationsService.getUnread(userId);
  }

  // ✅ Crear una notificación para un usuario (para pruebas)
  @Post()
  create(
    @Param('userId') userId: number,
    @Body() dto: Omit<CreateNotificationDto, 'userId'>,
  ) {
    return this.notificationsService.create(userId, dto.title, dto.message);
  }

  // ✅ Marcar como leída una notificación específica
  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
