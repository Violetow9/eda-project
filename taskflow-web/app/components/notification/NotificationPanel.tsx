'use client';

import { useEffect, useState } from 'react';
import {
  deleteNotification,
  fetchNotificationPreference,
  fetchNotifications,
  markNotificationAsRead,
  updateNotificationPreference,
} from '@/app/lib/api/notification-api';
import { AppNotification, NotificationPreference } from '@/app/types/notification';

type Props = {
  userId: string;
  refreshSignal?: number;
};

export default function NotificationPanel({ userId, refreshSignal = 0 }: Props) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [preference, setPreference] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPreference, setSavingPreference] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      setError(null);
      const data = await fetchNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur notifications');
    }
  }

  async function loadPanel() {
    try {
      setLoading(true);
      setError(null);
      const [notificationsData, preferenceData] = await Promise.all([
        fetchNotifications(userId),
        fetchNotificationPreference(userId),
      ]);
      setNotifications(notificationsData);
      setPreference(preferenceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur notifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPanel();
  }, [userId]);

  useEffect(() => {
    if (!loading) {
      loadNotifications();
    }
  }, [refreshSignal]);

  async function handleMarkAsRead(notificationId: number) {
    const updated = await markNotificationAsRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === updated.id ? updated : notification,
      ),
    );
  }
  async function handleDeleteNotification(notificationId: number) {
    await deleteNotification(notificationId);

    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId),
    );
  }

  async function handlePreferenceChange(next: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
  }) {
    try {
      setSavingPreference(true);
      setError(null);
      const updated = await updateNotificationPreference(userId, next);
      setPreference(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur préférences notifications',
      );
    } finally {
      setSavingPreference(false);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.readAt,
  ).length;

  return (
    <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Utilisateur simulé : {userId}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
            {unreadCount} non lue(s)
          </span>
          <button
            type="button"
            onClick={loadNotifications}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Préférences
        </h3>

        {loading || !preference ? (
          <p className="text-sm text-gray-500">Chargement des préférences...</p>
        ) : (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={preference.emailEnabled}
                disabled={savingPreference}
                onChange={(event) =>
                  handlePreferenceChange({
                    emailEnabled: event.target.checked,
                    inAppEnabled: preference.inAppEnabled,
                  })
                }
              />
              Email
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={preference.inAppEnabled}
                disabled={savingPreference}
                onChange={(event) =>
                  handlePreferenceChange({
                    emailEnabled: preference.emailEnabled,
                    inAppEnabled: event.target.checked,
                  })
                }
              />
              In-app
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement des notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune notification</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border p-4 ${
                notification.readAt
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-black bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {notification.type}
                  </p>
                  <h3 className="mt-1 font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.readAt && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Marquer lue
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
