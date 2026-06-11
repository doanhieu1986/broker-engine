import { useState } from 'react';
import { BrokerGrowthTab } from '../components/broker-growth/BrokerGrowthTab';

type TabType = 'trading' | 'broker-growth' | 'management' | 'reporting';

interface Tab {
  id: TabType;
  label: string;
  shortcut?: string;
}

export function BrokerManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('broker-growth');

  const tabs: Tab[] = [
    { id: 'trading', label: 'Giao dịch', shortcut: 'F12' },
    { id: 'broker-growth', label: 'Broker Growth', shortcut: 'F1' },
    { id: 'management', label: 'Quản lý', shortcut: 'F2' },
    { id: 'reporting', label: 'Báo cáo', shortcut: 'F3' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'broker-growth':
        return <BrokerGrowthTab />;
      case 'trading':
        return (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <p>Giao dịch content - Coming soon</p>
          </div>
        );
      case 'management':
        return (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <p>Quản lý content - Coming soon</p>
          </div>
        );
      case 'reporting':
        return (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <p>Báo cáo content - Coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Indices Header - Similar to trading platform */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Index Sample 1</span>
            <span className="text-lg font-bold text-white">2,080.21 △</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Index Sample 2</span>
            <span className="text-lg font-bold text-white">252.05 △</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Index Sample 3</span>
            <span className="text-lg font-bold text-white">121.24 △</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Index Sample 4</span>
            <span className="text-lg font-bold text-white">456.78 △</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.shortcut && (
              <span className="ml-2 text-xs text-gray-400">({tab.shortcut})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg">
        {renderTabContent()}
      </div>
    </div>
  );
}
