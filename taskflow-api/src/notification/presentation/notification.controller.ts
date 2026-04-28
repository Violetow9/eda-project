import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch } from '@nestjs/common';
import type { NotificationRepository } from '../domain/notification.repository.interface';
import { NOTIFICATION_REPOSITORY } from '../notification.constants';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  @Get(':userId')
  getByUserId(@Param('userId') userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }

  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationRepository.markAsRead(notificationId);
  }
  @Delete(':notificationId')
  deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<void> {
    return this.notificationRepository.remove(notificationId);
  }
}
