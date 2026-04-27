import { NotificationType } from './notification-channel.interface';

export class Notification {
  constructor(
    public readonly id: number | null,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly metadata: Record<string, unknown>,
    public readonly createdAt: Date,
    public readonly readAt: Date | null = null,
  ) {}
}
