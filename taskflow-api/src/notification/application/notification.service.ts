import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  NotificationChannel,
  NotificationChannelType,
} from '../domain/notification-channel.interface';
import { NotificationPreferenceService } from './notification-preference.service';
import { NOTIFICATION_CHANNELS } from '../notification.constants';
import { FailedNotificationQueueService } from './failed-notification-queue.service';
import { NotificationPayload } from '../domain/notification.types';
import { NotificationPreference } from '../domain/notification-preference.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NOTIFICATION_CHANNELS)
    private readonly channels: NotificationChannel[],
    private readonly preferences: NotificationPreferenceService,
    private readonly failedQueue: FailedNotificationQueueService,
  ) {}

  async notifyUser(payload: NotificationPayload): Promise<void> {
    const preference = await this.preferences.getByUserId(payload.userId);
    const enabledChannels = this.channels.filter((channel) =>
      this.isChannelEnabled(channel.channel, preference),
    );

    await Promise.all(
      enabledChannels.map((channel) => this.safeSend(channel, payload)),
    );
  }

  private isChannelEnabled(
    channel: NotificationChannelType,
    preference: NotificationPreference,
  ): boolean {
    switch (channel) {
      case 'email':
        return preference.emailEnabled;
      case 'in_app':
        return preference.inAppEnabled;
      default:
        return true;
    }
  }

  private async safeSend(
    channel: NotificationChannel,
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      await channel.send(payload);
    } catch (error) {
      this.logger.error(
        `Notification channel ${channel.channel} failed`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.failedQueue.enqueue({
        channel: channel.channel,
        payload,
        error,
      });
    }
  }
}