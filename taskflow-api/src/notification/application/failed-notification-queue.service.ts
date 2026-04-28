import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationChannelType } from '../domain/notification-channel.interface';
import { NotificationPayload } from '../domain/notification.types';
import { TypeOrmFailedNotificationMessage } from '../infrastructure/persistence/typeorm-failed-notification.entity';

@Injectable()
export class FailedNotificationQueueService {
  constructor(
    @InjectRepository(TypeOrmFailedNotificationMessage)
    private readonly repository: Repository<TypeOrmFailedNotificationMessage>,
  ) {}

  async enqueue(input: {
    channel: NotificationChannelType;
    payload: NotificationPayload;
    error: unknown;
  }): Promise<void> {
    const errorMessage = input.error instanceof Error ? input.error.message : String(input.error);
    await this.repository.save(this.repository.create({
      channel: input.channel,
      userId: input.payload.userId,
      type: input.payload.type,
      title: input.payload.title,
      message: input.payload.message,
      metadata: input.payload.metadata ?? {},
      errorMessage,
      status: 'pending',
      retryCount: 0,
    }));
  }

  findAll(): Promise<TypeOrmFailedNotificationMessage[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }
}
