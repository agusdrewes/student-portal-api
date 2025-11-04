import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';

@Controller('/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @UseGuards(JwtDecodeGuard)
  @Get()
  getLatest(@Param('userId') userId: string) {
    return this.notificationsService.getLatest(userId);
  }

  @Get('unread')
  getUnread(@Param('userId') userId: string) {
    return this.notificationsService.getUnread(userId);
  }

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @UseGuards(JwtDecodeGuard)
  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
