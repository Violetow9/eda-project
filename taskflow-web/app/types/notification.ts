export type NotificationType = 'task.moved' | 'task.assigned';

export interface AppNotification {
  id: number;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPreference {
  id: number | null;
  userId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
}
