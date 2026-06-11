import { useState } from 'react';
import { BrokerGrowthTab } from '../components/broker-growth/BrokerGrowthTab';

type TabType = 'trading' | 'customers' | 'contracts' | 'accounts' | 'market-summary' | 'stock-info' | 'customer-mgmt' | 'staff-mgmt' | 'account-register' | 'broker-growth';

interface Tab {
  id: TabType;
  label: string;
  shortcut: string;
}

export function BrokerManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('broker-growth');

  const tabs: Tab[] = [
    { id: 'trading', label: 'Giao dịch', shortcut: 'F12' },
    { id: 'broker-growth', label: 'Broker Growth', shortcut: 'F1' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'broker-growth':
        return <BrokerGrowthTab />;
      case 'trading':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Giao dịch - Coming soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-0 -mx-8 -mt-8">
      {/* Market Indices Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex gap-8">
            <div>
              <span className="text-xs text-gray-400">VN Index</span>
              <p className="text-sm font-bold text-white">1,902.93 <span className="text-red-400">△ (25.00)</span></p>
            </div>
            <div>
              <span className="text-xs text-gray-400">VN30-Index</span>
              <p className="text-sm font-bold text-white">2,080.21 <span className="text-green-400">△ (8.97 0.43%)</span></p>
            </div>
            <div>
              <span className="text-xs text-gray-400">HNX-Index</span>
              <p className="text-sm font-bold text-white">252.05 <span className="text-green-400">△ (0.97 0.39%)</span></p>
            </div>
            <div>
              <span className="text-xs text-gray-400">HNX30-Index</span>
              <p className="text-sm font-bold text-white">— </p>
            </div>
            <div>
              <span className="text-xs text-gray-400">UPCOM-Index</span>
              <p className="text-sm font-bold text-white">121.24 <span className="text-green-400">△ (0.68 0.55%)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-900 border-b border-slate-700 px-8 overflow-x-auto">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-b-blue-500 text-blue-400 bg-slate-800/50'
                  : 'border-b-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.shortcut})
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Khách hàng</p>
            <p className="text-lg font-bold text-white">2,000</p>
            <p className="text-xs text-red-400 mt-1">⬇ 100 -5%</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Active</p>
            <p className="text-lg font-bold text-white">100</p>
            <p className="text-xs text-red-400 mt-1">⬇ 100 -66%</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Mỏ mới</p>
            <p className="text-lg font-bold text-white">9</p>
            <p className="text-xs text-red-400 mt-1">⬇ Chưa XT-4</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Tổng NAV</p>
            <p className="text-sm font-bold text-white">200 tỷ</p>
            <p className="text-xs text-green-400 mt-1">⬆ 100 triệu -5%</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Phí giao dịch</p>
            <p className="text-sm font-bold text-white">20 tỷ</p>
            <p className="text-xs text-red-400 mt-1">⬇ 500 triệu -0.04%</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
            <p className="text-xs text-gray-400">Sức mua</p>
            <p className="text-sm font-bold text-white">20 tỷ</p>
            <p className="text-xs text-red-400 mt-1">⬇ 300 triệu -0.04%</p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-700">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
