import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, LogOut, Bell, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { NotificationPanel } from '../shared/NotificationPanel';
import { mockNotifications, type AppNotification } from '../../data/mockData';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Apply dark mode on mount and whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  // Apply dark mode immediately on first load to prevent flash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const { user, role, setRole } = useUser();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    mockNotifications
  );
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-3">
            <img
              src="https://vps.com.vn/_next/static/media/vps_wlogo.af6db381.png"
              alt="VPS Logo"
              className="h-8 w-auto dark:invert dark:brightness-110"
            />
            <h1 className="text-lg font-bold text-accent-600 dark:text-accent-300 hidden sm:block">
              ProDesk
            </h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Notifications */}
          <div className="relative" ref={notifContainerRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <NotificationPanel
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onClose={() => setIsNotifOpen(false)}
              />
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Info with Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 hover:opacity-75 transition-opacity"
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.subtitle}</p>
              </div>
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-9 h-9 rounded-full ring-2 ring-primary-200 dark:ring-primary-900"
              />
            </button>

            {/* Role Dropdown */}
            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <button
                  onClick={() => {
                    setRole('Manager');
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                    role === 'Manager' ? 'text-accent-600 dark:text-accent-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {role === 'Manager' && <Check size={16} />}
                  <span className="font-medium">Quản lý</span>
                </button>
                <button
                  onClick={() => {
                    setRole('Broker');
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                    role === 'Broker' ? 'text-accent-600 dark:text-accent-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {role === 'Broker' && <Check size={16} />}
                  <span className="font-medium">Broker</span>
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => setRole('Manager')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Reset to Manager role"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
