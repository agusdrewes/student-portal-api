import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('users/:userId/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  getLatest(@Param('userId') userId: string) {
    return this.notificationsService.getLatest(userId);
  }

  @Get('unread')
  getUnread(@Param('userId') userId: string) {
    return this.notificationsService.getUnread(userId);
  }

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() dto: Omit<CreateNotificationDto, 'userId'>,
  ) {
    return this.notificationsService.create(userId, dto.title, dto.message);
  }

  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
