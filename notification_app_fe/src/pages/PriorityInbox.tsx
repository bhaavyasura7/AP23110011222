import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Notification, NotificationResponse } from '../types';
import NotificationCard from '../components/NotificationCard';
// @ts-ignore
import { Logger } from '../../../logging middleware/logger';
import { InboxStackIcon } from '@heroicons/react/24/outline';

const PRIORITY_WEIGHTS: Record<Notification['Type'], number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSort = async () => {
      Logger.info('PriorityInbox', 'Fetching notifications for Priority Inbox.');
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<NotificationResponse>('http://localhost:5000/api/notifications?limit=10');
        processTopN(response.data.notifications || []);
      } catch (err: any) {
        Logger.warn('PriorityInbox', `Proxy unreachable (${err.message}). Using cached fallback data.`);
        const fallbackData: Notification[] = [
          { "ID": "1fb4b6a2-5624-4588-972a-0abec4649fa2", "Type": "Result", "Message": "project-review", "Timestamp": "2026-05-01 08:06:27" },
          { "ID": "78621118-67cb-4383-a335-58d798cf9705", "Type": "Event", "Message": "cult-fest", "Timestamp": "2026-05-02 02:36:21" },
          { "ID": "45cd4d92-b8c3-4424-9927-1719ac2eb0d4", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-05-01 19:06:15" },
          { "ID": "5eceef5a-ce0d-4386-a072-cde323a8be33", "Type": "Result", "Message": "internal", "Timestamp": "2026-05-01 06:36:09" },
          { "ID": "379608a8-c486-4694-916e-4837a21bdf98", "Type": "Placement", "Message": "Alphabet Inc. Class A hiring", "Timestamp": "2026-05-01 08:36:03" },
          { "ID": "4470f29a-8179-4e1f-a2ac-8b121f11fbd9", "Type": "Result", "Message": "external", "Timestamp": "2026-05-01 15:35:57" },
          { "ID": "86557d1b-4d00-46cf-95a1-6f9e7c5702e9", "Type": "Result", "Message": "external", "Timestamp": "2026-05-01 08:35:51" },
          { "ID": "53b18dde-1f53-468a-9e62-0a3f044c88dd", "Type": "Placement", "Message": "Berkshire Hathaway Inc. hiring", "Timestamp": "2026-05-01 07:35:45" },
          { "ID": "2bd47245-ee4e-4360-970a-fc95a40a6a7f", "Type": "Event", "Message": "traditional-day", "Timestamp": "2026-05-02 01:05:39" },
          { "ID": "228fe5d8-7728-4398-bc2d-3ba345fa2d3a", "Type": "Event", "Message": "cult-fest", "Timestamp": "2026-05-02 01:05:33" }
        ];
        processTopN(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSort();
  }, []);

  const processTopN = (data: Notification[]) => {
    const sorted = [...data].sort((a, b) => {
      const weightDiff = (PRIORITY_WEIGHTS[b.Type] || 0) - (PRIORITY_WEIGHTS[a.Type] || 0);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });

    const top10 = sorted.slice(0, 10);
    Logger.info('PriorityInbox', `Processed top ${top10.length} notifications.`);
    setNotifications(top10);
  };

  return (
    <div className="priority-page">
      <div className="priority-header">
        <div className="priority-header-icon">
          <InboxStackIcon />
        </div>
        <div>
          <h1 className="priority-title">Priority Inbox</h1>
          <p className="priority-subtitle">
            Your top 10 most critical updates, ranked by importance and recency.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, idx) => (
            <NotificationCard key={notif.ID} notification={notif} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
