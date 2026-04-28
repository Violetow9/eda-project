import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  NotificationChannel,
  NotificationType,
} from '../domain/notification-channel.interface';
import { NotificationPreferenceService } from './notification-preference.service';
import {
  EMAIL_NOTIFICATION_CHANNEL,
  IN_APP_NOTIFICATION_CHANNEL,
} from '../notification.constants';
import { FailedNotificationQueueService } from './failed-notification-queue.service';
import { InAppChannel } from '../infrastructure/channels/in-app.channel';
import { SmtpEmailChannel } from '../infrastructure/channels/smtp-email.channel';
import { NotificationPayload } from '../domain/notification.types';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly emailChannel: SmtpEmailChannel,
    private readonly inAppChannel: InAppChannel,
    private readonly failedQueue: FailedNotificationQueueService,
  ) {}

  async notifyUser(payload: NotificationPayload): Promise<void> {
    const channels: NotificationChannel[] = [this.emailChannel, this.inAppChannel];

    await Promise.all(channels.map((channel) => this.safeSend(channel, payload)));
  }

  private async safeSend(channel: NotificationChannel, payload: NotificationPayload): Promise<void> {
    try {
      await channel.send(payload);
    } catch (error) {
      this.logger.error(`Notification channel ${channel.channel} failed`, error instanceof Error ? error.stack : String(error));
      await this.failedQueue.enqueue({ channel: channel.channel, payload, error });
    }
  }
}
