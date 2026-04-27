export type NotificationType = 'task.moved' | 'task.assigned';
export type NotificationChannelType = 'email' | 'in_app';

export interface NotificationChannel {
  readonly channel: NotificationChannelType;

  send(input: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}
