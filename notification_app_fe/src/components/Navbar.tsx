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
      className="navbar"
    >
      <div className="navbar-brand">
        <span className="navbar-brand-dot" />
        CampusSync
      </div>
      <div className="navbar-links">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link${isActive ? ' active' : ''}`}
            >
              <Icon className="nav-icon" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
