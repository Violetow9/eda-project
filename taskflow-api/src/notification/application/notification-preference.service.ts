import { Inject, Injectable } from '@nestjs/common';
import type { NotificationPreferenceRepository } from '../domain/notification-preference.repository.interface';
import { NotificationPreference } from '../domain/notification-preference.entity';
import { NOTIFICATION_PREFERENCE_REPOSITORY } from '../notification.constants';

@Injectable()
export class NotificationPreferenceService {
  constructor(
    @Inject(NOTIFICATION_PREFERENCE_REPOSITORY)
    private readonly repository: NotificationPreferenceRepository,
  ) {}

  async getByUserId(userId: string): Promise<NotificationPreference> {
    const existing = await this.repository.findByUserId(userId);
    return existing ?? new NotificationPreference(null, userId, true, true);
  }

  async upsert(input: {
    userId: string;
    emailEnabled: boolean;
    inAppEnabled: boolean;
  }): Promise<NotificationPreference> {
    return this.repository.upsert(
      new NotificationPreference(
        null,
        input.userId,
        input.emailEnabled,
        input.inAppEnabled,
      ),
    );
  }
}
