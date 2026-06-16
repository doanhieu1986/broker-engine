import { useState } from 'react';
import { StatCard } from '../shared/StatCard';
import { Building2, Users, DollarSign, Zap, BarChart2, Briefcase, UserPlus, UserCheck } from 'lucide-react';

const formatCompactNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

// Monthly KPI Data
const monthlyDataIndividual = [
  { period: 'T1', customers: 110, activeCustomers: 98, commission: 20500000000, tradingValue: 825000000000, nav: 380000000000, aum: 95000000000, staff: 9, managerCustomers: 22 },
  { period: 'T2', customers: 116, activeCustomers: 104, commission: 22400000000, tradingValue: 920000000000, nav: 420000000000, aum: 105000000000, staff: 10, managerCustomers: 23 },
  { period: 'T3', customers: 108, activeCustomers: 96, commission: 19800000000, tradingValue: 790000000000, nav: 350000000000, aum: 88000000000, staff: 9, managerCustomers: 21 },
  { period: 'T4', customers: 122, activeCustomers: 110, commission: 24600000000, tradingValue: 980000000000, nav: 460000000000, aum: 115000000000, staff: 10, managerCustomers: 24 },
  { period: 'T5', customers: 109, activeCustomers: 97, commission: 20100000000, tradingValue: 805000000000, nav: 370000000000, aum: 92000000000, staff: 9, managerCustomers: 22 },
  { period: 'T6', customers: 128, activeCustomers: 115, commission: 26400000000, tradingValue: 1050000000000, nav: 510000000000, aum: 127000000000, staff: 11, managerCustomers: 25 },
  { period: 'T7', customers: 134, activeCustomers: 121, commission: 27900000000, tradingValue: 1110000000000, nav: 560000000000, aum: 140000000000, staff: 11, managerCustomers: 26 },
  { period: 'T8', customers: 119, activeCustomers: 107, commission: 22700000000, tradingValue: 910000000000, nav: 430000000000, aum: 107000000000, staff: 10, managerCustomers: 23 },
  { period: 'T9', customers: 136, activeCustomers: 123, commission: 28600000000, tradingValue: 1150000000000, nav: 580000000000, aum: 145000000000, staff: 11, managerCustomers: 27 },
  { period: 'T10', customers: 142, activeCustomers: 129, commission: 30200000000, tradingValue: 1210000000000, nav: 620000000000, aum: 155000000000, staff: 11, managerCustomers: 28 },
  { period: 'T11', customers: 131, activeCustomers: 118, commission: 27100000000, tradingValue: 1080000000000, nav: 550000000000, aum: 137000000000, staff: 11, managerCustomers: 25 },
  { period: 'T12', customers: 148, activeCustomers: 134, commission: 32400000000, tradingValue: 1290000000000, nav: 680000000000, aum: 170000000000, staff: 11, managerCustomers: 29 },
];

const monthlyDataTeam = monthlyDataIndividual.map(d => ({
  ...d,
  customers: Math.round(d.customers * 1.8),
  activeCustomers: Math.round(d.activeCustomers * 1.8),
  commission: Math.round(d.commission * 1.8),
  tradingValue: Math.round(d.tradingValue * 1.8),
  nav: Math.round(d.nav * 1.8),
  aum: Math.round(d.aum * 1.8),
  staff: Math.round(d.staff * 1.8),
  managerCustomers: Math.round(d.managerCustomers * 1.8),
}));

// Quarterly KPI Data
const quarterlyDataIndividual = [
  { period: 'Q1\'24', customers: 112, activeCustomers: 101, commission: 21300000000, tradingValue: 845000000000, nav: 383000000000, aum: 96000000000, staff: 9, managerCustomers: 22 },
  { period: 'Q2\'24', customers: 122, activeCustomers: 110, commission: 23800000000, tradingValue: 930000000000, nav: 430000000000, aum: 108000000000, staff: 10, managerCustomers: 24 },
  { period: 'Q3\'24', customers: 130, activeCustomers: 118, commission: 26100000000, tradingValue: 1020000000000, nav: 525000000000, aum: 131000000000, staff: 11, managerCustomers: 25 },
  { period: 'Q4\'24', customers: 141, activeCustomers: 128, commission: 29500000000, tradingValue: 1180000000000, nav: 615000000000, aum: 154000000000, staff: 11, managerCustomers: 26 },
];

const quarterlyDataTeam = quarterlyDataIndividual.map(d => ({
  ...d,
  customers: Math.round(d.customers * 1.8),
  activeCustomers: Math.round(d.activeCustomers * 1.8),
  commission: Math.round(d.commission * 1.8),
  tradingValue: Math.round(d.tradingValue * 1.8),
  nav: Math.round(d.nav * 1.8),
  aum: Math.round(d.aum * 1.8),
  staff: Math.round(d.staff * 1.8),
  managerCustomers: Math.round(d.managerCustomers * 1.8),
}));

// Yearly KPI Data
const yearlyDataIndividual = [
  { period: '2022', customers: 105, activeCustomers: 95, commission: 19600000000, tradingValue: 785000000000, nav: 350000000000, aum: 87000000000, staff: 8, managerCustomers: 20 },
  { period: '2023', customers: 118, activeCustomers: 106, commission: 23200000000, tradingValue: 925000000000, nav: 410000000000, aum: 103000000000, staff: 10, managerCustomers: 23 },
  { period: '2024', customers: 135, activeCustomers: 122, commission: 27800000000, tradingValue: 1110000000000, nav: 545000000000, aum: 136000000000, staff: 11, managerCustomers: 25 },
];

const yearlyDataTeam = yearlyDataIndividual.map(d => ({
  ...d,
  customers: Math.round(d.customers * 1.8),
  activeCustomers: Math.round(d.activeCustomers * 1.8),
  commission: Math.round(d.commission * 1.8),
  tradingValue: Math.round(d.tradingValue * 1.8),
  nav: Math.round(d.nav * 1.8),
  aum: Math.round(d.aum * 1.8),
  staff: Math.round(d.staff * 1.8),
  managerCustomers: Math.round(d.managerCustomers * 1.8),
}));

export function KPIManagementTabContent() {
  const [kpiType, setKpiType] = useState<'company' | 'team'>('team');
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('month');

  // Get current period data based on filters
  const getKPIData = () => {
    if (periodFilter === 'month') {
      return kpiType === 'company' ? monthlyDataIndividual[monthlyDataIndividual.length - 1] : monthlyDataTeam[monthlyDataTeam.length - 1];
    } else if (periodFilter === 'quarter') {
      return kpiType === 'company' ? quarterlyDataIndividual[quarterlyDataIndividual.length - 1] : quarterlyDataTeam[quarterlyDataTeam.length - 1];
    } else {
      return kpiType === 'company' ? yearlyDataIndividual[yearlyDataIndividual.length - 1] : yearlyDataTeam[yearlyDataTeam.length - 1];
    }
  };

  const currentKPIData = getKPIData();
  const totalCustomers = currentKPIData.customers;
  const activeCustomers = currentKPIData.activeCustomers;
  const totalCommission = currentKPIData.commission;
  const totalTradingValue = currentKPIData.tradingValue;
  const totalNAV = currentKPIData.nav;
  const totalAUM = currentKPIData.aum;
  const staffCount = currentKPIData.staff;
  const managerOwnCustomers = currentKPIData.managerCustomers;

  const calculateProjectedValue = (currentValue: number, trendPercent: number): number => {
    return Math.round(currentValue * (1 + trendPercent / 100));
  };

  const kpiTargets = {
    company: {
      customerPlanTarget: 155,
      activeCustomerPlanTarget: 115,
      commissionPlanTarget: 200000000000,
      tradingValuePlanTarget: 8000000000000,
      navPlanTarget: 400000000000,
      aumPlanTarget: 950000000000,
      staffPlanTarget: 11,
      managerCustomerPlanTarget: 25,
    },
    team: {
      customerPlanTarget: 160,
      activeCustomerPlanTarget: 115,
      commissionPlanTarget: 180000000000,
      tradingValuePlanTarget: 7200000000000,
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
            <span>Cá nhân</span>
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
            <span>Team</span>
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
