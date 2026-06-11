export type TopTabType = 'trading' | 'customers' | 'agreements' | 'account-management' | 'market-summary' | 'stock-info' | 'customer-management' | 'staff-management' | 'account-registration' | 'broker-growth';

interface TopTab {
  id: TopTabType;
  label: string;
  shortcut: string;
  icon?: React.ReactNode;
}

interface BrokerTopNavigationProps {
  activeTab: TopTabType;
  onTabChange: (tab: TopTabType) => void;
}

export function BrokerTopNavigation({ activeTab, onTabChange }: BrokerTopNavigationProps) {

  const topTabs: TopTab[] = [
    { id: 'trading', label: 'Giao dịch', shortcut: 'F12' },
    { id: 'customers', label: 'Khách hàng', shortcut: 'F9' },
    { id: 'agreements', label: 'Thỏa thuận', shortcut: 'F8' },
    { id: 'account-management', label: 'Quản trị tài khoản', shortcut: 'F5' },
    { id: 'market-summary', label: 'Market Summary', shortcut: 'F4' },
    { id: 'stock-info', label: 'Stock Info', shortcut: 'F2' },
    { id: 'customer-management', label: 'Quản trị khách hàng', shortcut: 'F6' },
    { id: 'staff-management', label: 'Quản trị nhân viên', shortcut: 'F7' },
    { id: 'account-registration', label: 'Đăng ký CS Tài khoản', shortcut: 'F10' },
    { id: 'broker-growth', label: 'Broker Growth', shortcut: '' },
  ];

  const getTabContent = () => {
    const tabLabels: Record<TopTabType, string> = {
      'trading': 'Giao dịch',
      'customers': 'Khách hàng',
      'agreements': 'Thỏa thuận',
      'account-management': 'Quản trị tài khoản',
      'market-summary': 'Market Summary',
      'stock-info': 'Stock Info',
      'customer-management': 'Quản trị khách hàng',
      'staff-management': 'Quản trị nhân viên',
      'account-registration': 'Đăng ký CS Tài khoản',
      'broker-growth': 'Broker Growth',
    };

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg min-h-96">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {tabLabels[activeTab]}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Nội dung tab "{tabLabels[activeTab]}" sẽ được thêm ở đây
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-0 py-3 min-w-max">
          {topTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-0 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-b-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.shortcut && <span className="text-xs font-normal opacity-70"> ({tab.shortcut})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Only show for non-Broker Growth tabs */}
      {activeTab !== 'broker-growth' && getTabContent()}
    </div>
  );
}
