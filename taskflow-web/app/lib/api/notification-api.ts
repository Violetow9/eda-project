import { AppNotification, NotificationPreference } from "@/app/types/notification";

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  const response = await fetch(`/api/users/${userId}/notifications`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch notifications');
  }

  return response.json();
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<AppNotification> {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to mark notification as read');
  }

  return response.json();
}

export async function fetchNotificationPreference(
  userId: string,
): Promise<NotificationPreference> {
  const response = await fetch(`/api/users/${userId}/notification-preferences`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch notification preferences');
  }

  return response.json();
}

export async function updateNotificationPreference(
  userId: string,
  input: { emailEnabled: boolean; inAppEnabled: boolean },
): Promise<NotificationPreference> {
  const response = await fetch(`/api/users/${userId}/notification-preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update notification preferences');
  }

  return response.json();
  
}

export async function deleteNotification(notificationId: number): Promise<void> {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to delete notification');
  }
}