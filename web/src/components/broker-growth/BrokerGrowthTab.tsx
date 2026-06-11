import { useState } from 'react';
import { DashboardTabContent } from './DashboardTabContent';
import { CustomerOverviewTabContent } from './CustomerOverviewTabContent';
import { CustomerListTabContent } from './CustomerListTabContent';
import { ReportsTabContent } from './ReportsTabContent';
import { KPIManagementTabContent } from './KPIManagementTabContent';
import { OpportunitiesTabContent } from './OpportunitiesTabContent';
import { PerformanceTabContent } from './PerformanceTabContent';

type InternalTabType = 'dashboard' | 'opportunities' | 'customer-overview' | 'customer-list' | 'kpi' | 'performance' | 'reports';

export function BrokerGrowthTab() {
  const [activeInternalTab, setActiveInternalTab] = useState<InternalTabType>('dashboard');

  const internalTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'opportunities', label: 'Đại chúng hóa VCK' },
    { id: 'customer-overview', label: 'Tổng quan khách hàng' },
    { id: 'customer-list', label: 'Danh sách khách hàng' },
    { id: 'kpi', label: 'Quản lý KPI' },
    { id: 'performance', label: 'Hiệu suất' },
    { id: 'reports', label: 'Báo cáo' },
  ];

  return (
    <div className="space-y-0">
      {/* Internal Tab Navigation */}
      <div className="flex gap-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-6">
        {internalTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveInternalTab(tab.id as InternalTabType)}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
              activeInternalTab === tab.id
                ? 'border-b-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeInternalTab === 'dashboard' && (
        <DashboardTabContent />
      )}

      {/* Customer Overview Tab */}
      {activeInternalTab === ('customer-overview' as InternalTabType) && (
        <CustomerOverviewTabContent />
      )}

      {/* Customer List Tab */}
      {activeInternalTab === ('customer-list' as InternalTabType) && (
        <CustomerListTabContent />
      )}

      {/* Báo cáo Tab */}
      {activeInternalTab === ('reports' as InternalTabType) && (
        <ReportsTabContent />
      )}

      {/* Quản lý KPI Tab */}
      {activeInternalTab === ('kpi' as InternalTabType) && (
        <KPIManagementTabContent />
      )}

      {/* Opportunities Tab */}
      {activeInternalTab === ('opportunities' as InternalTabType) && (
        <OpportunitiesTabContent />
      )}

      {/* Hiệu suất Tab */}
      {activeInternalTab === ('performance' as InternalTabType) && (
        <PerformanceTabContent />
      )}
    </div>
  );
}
