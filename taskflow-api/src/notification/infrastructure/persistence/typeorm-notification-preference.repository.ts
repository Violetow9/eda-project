import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationPreferenceRepository } from '../../domain/notification-preference.repository.interface';
import { TypeOrmNotificationPreference } from './typeorm-notification-preference.entity';
import { NotificationPreference } from '../../domain/notification-preference.entity';

@Injectable()
export class TypeOrmNotificationPreferenceRepository implements NotificationPreferenceRepository {
  constructor(
    @InjectRepository(TypeOrmNotificationPreference)
    private readonly repository: Repository<TypeOrmNotificationPreference>,
  ) {}

  async findByUserId(userId: string): Promise<NotificationPreference | null> {
    const preference = await this.repository.findOneBy({ userId });
    return preference ? this.toDomain(preference) : null;
  }

  async upsert(
    preference: NotificationPreference,
  ): Promise<NotificationPreference> {
    const existing = await this.repository.findOneBy({
      userId: preference.userId,
    });

    const entity = this.repository.create({
      id: existing?.id,
      userId: preference.userId,
      emailEnabled: preference.emailEnabled,
      inAppEnabled: preference.inAppEnabled,
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(
    preference: TypeOrmNotificationPreference,
  ): NotificationPreference {
    return new NotificationPreference(
      preference.id,
      preference.userId,
      preference.emailEnabled,
      preference.inAppEnabled,
    );
  }
}
