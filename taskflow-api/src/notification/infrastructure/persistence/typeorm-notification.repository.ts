import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationRepository } from '../../domain/notification.repository.interface';
import { TypeOrmNotification } from './typeorm-notification.entity';
import { Notification } from '../../domain/notification.entity';
import { NotificationType } from '../../domain/notification-channel.interface';

@Injectable()
export class TypeOrmNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(TypeOrmNotification)
    private readonly repository: Repository<TypeOrmNotification>,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const entity = this.repository.create({
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata,
      readAt: notification.readAt,
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((notification) => this.toDomain(notification));
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
  }
  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.repository.findOneBy({
      id: notificationId,
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with id ${notificationId} not found`,
      );
    }

    notification.readAt = new Date();
    const saved = await this.repository.save(notification);
    return this.toDomain(saved);
  }

  private toDomain(notification: TypeOrmNotification): Notification {
    return new Notification(
      notification.id,
      notification.userId,
      notification.type as NotificationType,
      notification.title,
      notification.message,
      notification.metadata ?? {},
      notification.createdAt,
      notification.readAt,
    );
  }
}
