import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Notification, NotificationResponse } from '../types';
import NotificationCard from '../components/NotificationCard';
// @ts-ignore
import { Log } from '../../../logging middleware/logger';
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
      Log('frontend', 'info', 'page', 'Fetching notifications for Priority Inbox.');
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<NotificationResponse>('http://localhost:5000/api/notifications?limit=10');
        processTopN(response.data.notifications || []);
      } catch (error: any) {
        Log('frontend', 'error', 'page', `API fetch failed: ${error.message}`);
        if (error.response?.status === 401 || error.response?.data?.error === 'Backend token expired.') {
          setError("Backend token expired.");
        } else {
          setError("Unable to load notifications.");
        }
        setNotifications([]);
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
    
    // Configurable 'n' -> let's use top 10 as specified in stage 1
    const top10 = sorted.slice(0, 10);
    Log('frontend', 'info', 'page', `Processed top ${top10.length} notifications.`);
    setNotifications(top10);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
        <div className="p-4 bg-primary text-primary-foreground rounded-none shadow-md">
          <InboxStackIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Priority Inbox</h1>
          <p className="text-muted-foreground font-sans mt-2">
            Your top 10 most critical updates, ranked by importance and recency.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive p-4 mb-8 text-center font-sans">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notif, idx) => (
            <NotificationCard key={notif.ID} notification={notif} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
