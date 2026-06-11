import { useState } from 'react';
import { BrokerGrowthTab } from '../components/broker-growth/BrokerGrowthTab';
import { BrokerTopNavigation } from '../components/broker-growth/BrokerTopNavigation';

type TopTabType = 'trading' | 'customers' | 'agreements' | 'account-management' | 'market-summary' | 'stock-info' | 'customer-management' | 'staff-management' | 'account-registration' | 'broker-growth';

export function BrokerManagementPage() {
  const [activeTopTab, setActiveTopTab] = useState<TopTabType>('trading');

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

      {/* Content Area */}
      <div className="px-8 py-6 space-y-6">
        {/* Top Navigation Tabs */}
        <BrokerTopNavigation activeTab={activeTopTab} onTabChange={setActiveTopTab} />

        {/* Internal Broker Growth Tabs - Only show when Broker Growth tab is active */}
        {activeTopTab === 'broker-growth' && (
          <BrokerGrowthTab />
        )}
      </div>
    </div>
  );
}
