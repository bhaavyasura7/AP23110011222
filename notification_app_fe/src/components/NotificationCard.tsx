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
      case 'Placement': return <BriefcaseIcon className="w-6 h-6 text-primary" />;
      case 'Result': return <AcademicCapIcon className="w-6 h-6 text-chart-2" />;
      case 'Event': return <CalendarIcon className="w-6 h-6 text-chart-3" />;
      default: return <CalendarIcon className="w-6 h-6 text-primary" />;
    }
  };

  const formattedDate = new Date(notification.Timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      // Rectangular, no rounded corners, solid background to immerse (no glassmorphism)
      className="w-full flex items-start gap-4 p-6 bg-background border-t border-b border-border shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="mt-1 p-3 bg-secondary rounded-none">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {notification.Type}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formattedDate}
          </span>
        </div>
        <p className="text-foreground text-lg font-serif">
          {notification.Message}
        </p>
      </div>
    </motion.div>
  );
}
