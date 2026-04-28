import { Inject, Injectable } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationChannelType,
  NotificationType,
} from '../../domain/notification-channel.interface';
import type { NotificationRepository } from '../../domain/notification.repository.interface';
import { Notification } from '../../domain/notification.entity';
import { NOTIFICATION_REPOSITORY } from '../../notification.constants';

@Injectable()
export class InAppChannel implements NotificationChannel {
  readonly channel: NotificationChannelType = 'in_app';

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async send(input: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.notificationRepository.create(
      new Notification(
        null,
        input.userId,
        input.type,
        input.title,
        input.message,
        input.metadata ?? {},
        new Date(),
        null,
      ),
    );
  }
}
