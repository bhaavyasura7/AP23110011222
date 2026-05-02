import { Link, useLocation } from 'react-router-dom';
import { BellIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'All Notifications', path: '/', icon: BellIcon },
    { name: 'Priority Inbox', path: '/priority', icon: InboxStackIcon },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-card shadow-lg border border-border"
    >
      <div className="text-primary font-bold mr-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-primary block"></span>
        CampusSync
      </div>
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 transition-colors duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
