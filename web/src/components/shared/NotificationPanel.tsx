import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingDown,
  MessageSquare,
  UserCheck,
  Users,
  Newspaper,
} from 'lucide-react';
import type { AppNotification } from '../../data/mockData';

interface NotificationPanelProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

const priorityColors = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

const categoryIcons: Record<
  'margin' | 'kpi' | 'support' | 'staff' | 'customer' | 'market',
  React.ReactNode
> = {
  margin: <AlertTriangle size={16} className="text-red-500" />,
  kpi: <TrendingDown size={16} className="text-orange-500" />,
  support: <MessageSquare size={16} className="text-purple-500" />,
  staff: <UserCheck size={16} className="text-green-500" />,
  customer: <Users size={16} className="text-blue-500" />,
  market: <Newspaper size={16} className="text-indigo-500" />,
};

const categoryRoutes: Record<AppNotification['category'], string> = {
  margin: '/reports?tab=margin',
  kpi: '/',
  support: '/reports?tab=support',
  staff: '/reports?tab=staffPotential',
  customer: '/reports?tab=birthday',
  market: '/reports?tab=news',
};

export function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: NotificationPanelProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkRead(notif.id);
    const route = categoryRoutes[notif.category];
    onClose();
    navigate(route);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Thông báo{' '}
          {unreadCount > 0 && (
            <span className="text-red-500">({unreadCount} chưa đọc)</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Đọc tất cả
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">Không có thông báo</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors flex gap-3 ${
                !notif.isRead
                  ? 'bg-slate-50 dark:bg-slate-800/60'
                  : ''
              }`}
            >
              {/* Priority dot */}
              <div className="flex-shrink-0 pt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    priorityColors[notif.priority]
                  }`}
                ></div>
              </div>

              {/* Category icon */}
              <div className="flex-shrink-0 pt-0.5">
                {categoryIcons[notif.category]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold text-slate-900 dark:text-white truncate ${
                    !notif.isRead ? 'font-bold' : ''
                  }`}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {notif.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {notif.time}
                </p>
              </div>

              {/* Unread indicator */}
              {!notif.isRead && (
                <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-1.5"></div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
