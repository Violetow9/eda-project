export type NotificationType = 'task.assigned' | 'task.moved';
export type NotificationChannelType = 'email' | 'in_app';

export type NotificationPayload = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export interface NotificationChannel {
  readonly channel: NotificationChannelType;
  send(payload: NotificationPayload): Promise<void>;
}
