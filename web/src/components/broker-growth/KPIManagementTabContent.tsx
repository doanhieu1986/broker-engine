import { useState } from 'react';
import { StatCard } from '../shared/StatCard';
import { Building2, Users, DollarSign, Zap, BarChart2, Briefcase, UserPlus, UserCheck } from 'lucide-react';
import { mockCustomers, mockTransactions, mockStaff } from '../../data/mockData';
import { useUser } from '../../context/UserContext';

const formatCompactNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

export function KPIManagementTabContent() {
  const { role, user } = useUser();
  const [kpiType, setKpiType] = useState<'company' | 'team'>('team');
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('month');

  // Calculate summary metrics
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.activeStatus).length;
  const totalCommission = mockTransactions.reduce((sum, t) => sum + t.commission, 0);
  const totalTradingValue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  const totalNAV = mockCustomers.reduce((sum, c) => sum + c.nav, 0);
  const totalAUM = mockCustomers.reduce((sum, c) => sum + c.aum, 0);

  const userStaff = mockStaff.filter(s => s.brokerCode === user.brokerCode);
  const userCustomers = mockCustomers.filter(c => c.brokerCode === user.brokerCode);

  const staffCount = role === 'Manager' ? (user.managedBrokerCodes?.length || 0) : userStaff.length;
  const managerOwnCustomers = userCustomers.length;

  const calculateProjectedValue = (currentValue: number, trendPercent: number): number => {
    return Math.round(currentValue * (1 + trendPercent / 100));
  };

  const kpiTargets = {
    company: {
      customerPlanTarget: 155,
      activeCustomerPlanTarget: 115,
      commissionPlanTarget: 3000000000,
      tradingValuePlanTarget: 200000000000,
      navPlanTarget: 400000000000,
      aumPlanTarget: 950000000000,
      staffPlanTarget: 11,
      managerCustomerPlanTarget: 25,
    },
    team: {
      customerPlanTarget: 160,
      activeCustomerPlanTarget: 115,
      commissionPlanTarget: 2500000000,
      tradingValuePlanTarget: 150000000000,
      navPlanTarget: 400000000000,
      aumPlanTarget: 900000000000,
      staffPlanTarget: 11,
      managerCustomerPlanTarget: 22,
    },
  };

  const targets = kpiTargets[kpiType];

  const customerCompletion = (totalCustomers / targets.customerPlanTarget) * 100;
  const customerProjectedValue = calculateProjectedValue(totalCustomers, 12);
  const customerMissing = Math.max(0, targets.customerPlanTarget - customerProjectedValue);

  const activeCompletion = (activeCustomers / targets.activeCustomerPlanTarget) * 100;
  const activeProjectedValue = calculateProjectedValue(activeCustomers, 8);
  const activeMissing = Math.max(0, targets.activeCustomerPlanTarget - activeProjectedValue);

  const commissionCompletion = (totalCommission / targets.commissionPlanTarget) * 100;
  const commissionProjectedValue = calculateProjectedValue(totalCommission, 15);
  const commissionMissing = Math.max(0, targets.commissionPlanTarget - commissionProjectedValue);

  const tradingValueCompletion = (totalTradingValue / targets.tradingValuePlanTarget) * 100;
  const tradingValueProjectedValue = calculateProjectedValue(totalTradingValue, -5);
  const tradingValueMissing = Math.max(0, targets.tradingValuePlanTarget - tradingValueProjectedValue);

  const navCompletion = (totalNAV / targets.navPlanTarget) * 100;
  const navProjectedValue = calculateProjectedValue(totalNAV, 10);
  const navMissing = Math.max(0, targets.navPlanTarget - navProjectedValue);

  const aumCompletion = (totalAUM / targets.aumPlanTarget) * 100;
  const aumProjectedValue = calculateProjectedValue(totalAUM, 12);
  const aumMissing = Math.max(0, targets.aumPlanTarget - aumProjectedValue);

  const staffProjectedValue = calculateProjectedValue(staffCount, 5);
  const staffCompletion = (staffCount / targets.staffPlanTarget) * 100;
  const staffMissing = Math.max(0, targets.staffPlanTarget - staffProjectedValue);

  const managerCustomerProjectedValue = calculateProjectedValue(managerOwnCustomers, 8);
  const managerCustomerCompletion = (managerOwnCustomers / targets.managerCustomerPlanTarget) * 100;
  const managerCustomerMissing = Math.max(0, targets.managerCustomerPlanTarget - managerCustomerProjectedValue);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setKpiType('company')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              kpiType === 'company'
                ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Building2 size={16} />
            <span>Công ty</span>
          </button>
          <button
            onClick={() => setKpiType('team')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              kpiType === 'team'
                ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Users size={16} />
            <span>Đội nhóm</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriodFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              periodFilter === 'month'
                ? 'bg-accent-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Tháng
          </button>
          <button
            onClick={() => setPeriodFilter('quarter')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              periodFilter === 'quarter'
                ? 'bg-accent-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Quý
          </button>
          <button
            onClick={() => setPeriodFilter('year')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              periodFilter === 'year'
                ? 'bg-accent-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Năm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng khách hàng"
          value={totalCustomers}
          unit="khách hàng"
          icon={<Users size={24} />}
          trend={12}
          variant="primary"
          projectedValue={customerProjectedValue}
          planCompletion={customerCompletion}
          amountMissing={customerMissing}
        />
        <StatCard
          title="Khách hàng hoạt động"
          value={activeCustomers}
          unit="khách hàng"
          icon={<Users size={24} />}
          trend={8}
          variant="success"
          projectedValue={activeProjectedValue}
          planCompletion={activeCompletion}
          amountMissing={activeMissing}
        />
        <StatCard
          title="Phí HHMG"
          value={(totalCommission / 1000000000).toFixed(2)}
          unit="tỷ đồng"
          icon={<DollarSign size={24} />}
          trend={15}
          variant="warning"
          projectedValue={(commissionProjectedValue / 1000000000).toFixed(2)}
          currentNumericValue={totalCommission / 1000000000}
          projectedNumericValue={commissionProjectedValue / 1000000000}
          planCompletion={commissionCompletion}
          amountMissing={(commissionMissing / 1000000000).toFixed(2)}
        />
        <StatCard
          title="Giá trị giao dịch"
          value={formatCompactNumber(totalTradingValue / 1000000000)}
          unit="tỷ đồng"
          icon={<Zap size={24} />}
          trend={-5}
          variant="accent"
          projectedValue={formatCompactNumber(tradingValueProjectedValue / 1000000000)}
          currentNumericValue={totalTradingValue / 1000000000}
          projectedNumericValue={tradingValueProjectedValue / 1000000000}
          planCompletion={tradingValueCompletion}
          amountMissing={formatCompactNumber(tradingValueMissing / 1000000000)}
        />
        <StatCard
          title="Tổng NAV"
          value={(totalNAV / 1000000000).toFixed(1)}
          unit="tỷ đồng"
          icon={<BarChart2 size={24} />}
          trend={10}
          variant="primary"
          projectedValue={(navProjectedValue / 1000000000).toFixed(1)}
          currentNumericValue={totalNAV / 1000000000}
          projectedNumericValue={navProjectedValue / 1000000000}
          planCompletion={navCompletion}
          amountMissing={(navMissing / 1000000000).toFixed(1)}
        />
        <StatCard
          title="Tổng AUM"
          value={(totalAUM / 1000000000).toFixed(1)}
          unit="tỷ đồng"
          icon={<Briefcase size={24} />}
          trend={12}
          variant="accent"
          projectedValue={(aumProjectedValue / 1000000000).toFixed(1)}
          currentNumericValue={totalAUM / 1000000000}
          projectedNumericValue={aumProjectedValue / 1000000000}
          planCompletion={aumCompletion}
          amountMissing={(aumMissing / 1000000000).toFixed(1)}
        />
        <StatCard
          title="Số lượng nhân viên"
          value={staffCount}
          unit="nhân viên"
          icon={<UserPlus size={24} />}
          trend={5}
          variant="success"
          projectedValue={staffProjectedValue}
          planCompletion={staffCompletion}
          amountMissing={staffMissing}
        />
        <StatCard
          title="Khách hàng quản lý"
          value={`${managerOwnCustomers}/${totalCustomers}`}
          unit="khách hàng"
          icon={<UserCheck size={24} />}
          trend={8}
          variant="warning"
          projectedValue={`${managerCustomerProjectedValue}/${totalCustomers}`}
          currentNumericValue={managerOwnCustomers}
          projectedNumericValue={managerCustomerProjectedValue}
          planCompletion={managerCustomerCompletion}
          amountMissing={managerCustomerMissing}
        />
      </div>

    </div>
  );
}
