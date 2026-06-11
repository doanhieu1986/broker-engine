import { Users, FileText, TrendingUp, Settings, Home, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, type Role } from '../../context/UserContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  roles?: Role[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { role } = useUser();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '/',
    },
    {
      label: 'Broker Growth',
      icon: <BarChart3 size={20} />,
      href: '/broker-management',
    },
    {
      label: 'Quản lý khách hàng',
      icon: <Users size={20} />,
      href: '/customers',
    },
    {
      label: 'Báo cáo',
      icon: <FileText size={20} />,
      href: '/reports',
    },
    {
      label: 'Hiệu suất',
      icon: <TrendingUp size={20} />,
      href: '/performance',
    },
  ];

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(role)
  );

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 z-30 lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex flex-col h-full">
          {/* Navigation items */}
          <div className="flex-1 px-3 py-6 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`${isActive(item.href) ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-accent-600'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Bottom section */}
          <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
              <Settings size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-primary-600" />
              <span className="font-medium">Cài đặt</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
