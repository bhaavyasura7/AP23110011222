import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Notification, NotificationResponse, NotificationType } from '../types';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import NotificationCard from '../components/NotificationCard';
// @ts-ignore - Importing from outside src
import { Log } from '../../../logging middleware/logger';

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<NotificationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const fetchData = async () => {
    Log('frontend', 'info', 'page', `Fetching notifications. Type filter: ${selectedType || 'All'}`);
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/notifications?limit=10';
      if (selectedType) {
        url += `&notification_type=${selectedType}`;
      }
      const response = await axios.get<NotificationResponse>(url);
      setNotifications(response.data.notifications || []);
      Log('frontend', 'info', 'page', `Successfully fetched ${response.data.notifications?.length || 0} notifications.`);
    } catch (err: any) {
      Log('frontend', 'error', 'page', `API fetch failed: ${err.message}`);
      if (err.response?.status === 401 || err.response?.data?.error === 'Backend token expired.') {
        setError("Backend token expired.");
      } else {
        setError("Unable to load notifications.");
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <HeroSection />
      
      <div className="max-w-4xl mx-auto px-4">
        <FilterBar selectedType={selectedType} onSelect={setSelectedType} />

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
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No notifications found.</p>
            ) : (
              notifications.map((notif, idx) => (
                <NotificationCard key={notif.ID} notification={notif} index={idx} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
