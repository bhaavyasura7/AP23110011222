import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Notification, NotificationResponse, NotificationType } from '../types';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import NotificationCard from '../components/NotificationCard';
// @ts-ignore - Importing from outside src
import { Logger } from '../../../logging middleware/logger';

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<NotificationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const fetchData = async () => {
    Logger.info('Home', `Fetching notifications. Type filter: ${selectedType || 'All'}`);
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/notifications?limit=10';
      if (selectedType) {
        url += `&notification_type=${selectedType}`;
      }
      const response = await axios.get<NotificationResponse>(url);
      setNotifications(response.data.notifications || []);
      Logger.info('Home', `Successfully fetched ${response.data.notifications?.length || 0} notifications.`);
    } catch (err: any) {
      Logger.warn('Home', `Proxy unreachable (${err.message}). Using cached fallback data.`);
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
      setNotifications(selectedType ? fallbackData.filter(n => n.Type === selectedType) : fallbackData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <HeroSection />

      <div className="container">
        <FilterBar selectedType={selectedType} onSelect={setSelectedType} />

        {error && (
          <div className="error-banner">{error}</div>
        )}

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="empty-state">No notifications found.</p>
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
