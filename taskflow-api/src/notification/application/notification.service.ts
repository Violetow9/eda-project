import { Inject, Injectable } from '@nestjs/common';
import type {
  NotificationChannel,
  NotificationType,
} from '../domain/notification-channel.interface';
import { NotificationPreferenceService } from './notification-preference.service';
import {
  EMAIL_NOTIFICATION_CHANNEL,
  IN_APP_NOTIFICATION_CHANNEL,
} from '../notification.constants';

@Injectable()
export class NotificationService {
  constructor(
    private readonly preferenceService: NotificationPreferenceService,
    @Inject(EMAIL_NOTIFICATION_CHANNEL)
    private readonly emailChannel: NotificationChannel,
    @Inject(IN_APP_NOTIFICATION_CHANNEL)
    private readonly inAppChannel: NotificationChannel,
  ) {}

  async notifyUser(input: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const preference = await this.preferenceService.getByUserId(input.userId);
    const jobs: Promise<void>[] = [];

    if (preference.emailEnabled) {
      jobs.push(this.emailChannel.send(input));
    }

    if (preference.inAppEnabled) {
      jobs.push(this.inAppChannel.send(input));
    }

    await Promise.all(jobs);
  }
}
