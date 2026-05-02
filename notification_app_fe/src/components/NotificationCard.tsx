import type { Notification } from '../types';
import { motion } from 'framer-motion';
import { AcademicCapIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Props {
  notification: Notification;
  index: number;
}

export default function NotificationCard({ notification, index }: Props) {
  const getIcon = () => {
    switch (notification.Type) {
      case 'Placement':
        return <BriefcaseIcon className="icon-placement" />;
      case 'Result':
        return <AcademicCapIcon className="icon-result" />;
      case 'Event':
        return <CalendarIcon className="icon-event" />;
      default:
        return <CalendarIcon className="icon-event" />;
    }
  };

  const formattedDate = new Date(notification.Timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="notification-card"
    >
      <div className="notification-card-icon-wrap">
        {getIcon()}
      </div>
      <div className="notification-card-body">
        <div className="notification-card-header">
          <span className="notification-type-badge">{notification.Type}</span>
          <span className="notification-timestamp">{formattedDate}</span>
        </div>
        <p className="notification-message">{notification.Message}</p>
      </div>
    </motion.div>
  );
}
