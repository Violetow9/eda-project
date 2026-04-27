import { Notification } from './notification.entity';

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: number): Promise<Notification>;
  remove(id: number): Promise<void>;
}
