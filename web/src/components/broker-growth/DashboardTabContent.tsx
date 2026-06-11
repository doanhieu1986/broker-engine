import { useState } from 'react';
import { StatCard } from '../shared/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Users, DollarSign, Zap, BarChart2, Briefcase, UserPlus, UserCheck, Building2 } from 'lucide-react';
import { mockCustomers, mockTransactions, mockStaff } from '../../data/mockData';
import { useUser } from '../../context/UserContext';

const formatCompactNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

export function DashboardTabContent() {
  const { role, user } = useUser();
  const [activeTab, setActiveTab] = useState<'kpi' | 'recommendation'>('recommendation');
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

  // VCK Opportunities Scoring
  const scoreForVCK = (c: any): number => {
    let score = 0;
    if (c.classification === 'VIP') score += 25;
    else if (c.classification === 'Affluent') score += 19;
    else if (c.classification === 'Mass Affluent') score += 10;
    else score += 3;
    if (c.navGroup.includes('>2B') || c.navGroup.includes('Nhóm A')) score += 21;
    else if (c.navGroup.includes('500M') || c.navGroup.includes('Nhóm B')) score += 13;
    else score += 5;
    if (c.activeStatus) score += 10;
    if (c.riskAppetite === 'Cao') score += 10;
    else if (c.riskAppetite === 'Cân bằng') score += 7;
    else score += 2;
    if (c.preferredProducts.includes('Chứng khoán')) score += 7;
    if (c.interestedIndustries.includes('Ngân hàng')) score += 6;
    if (c.marginStatus === 'Monitoring') score += 5;
    else if (c.marginStatus === 'Warning') score += 2;
    if (c.profit > 0) score += 2;
    return score;
  };

  const hasAlreadyBought = (c: any, score: number) => {
    const hash = parseInt(c.id.replace(/-/g, '').slice(-4), 16);
    if (score >= 70) return hash % 100 < 35;
    else if (score >= 40) return hash % 100 < 15;
    else return hash % 100 < 60;
  };

  const vckAnalysisCustomers = role === 'Manager' ? mockCustomers : userCustomers;

  const brokerVCKMap: Record<string, { high: number; medium: number; low: number; bought: number }> = {};
  vckAnalysisCustomers.forEach(c => {
    const score = scoreForVCK(c);
    const bought = hasAlreadyBought(c, score);
    if (!brokerVCKMap[c.brokerName]) {
      brokerVCKMap[c.brokerName] = { high: 0, medium: 0, low: 0, bought: 0 };
    }
    if (score >= 70) brokerVCKMap[c.brokerName].high++;
    else if (score >= 40) brokerVCKMap[c.brokerName].medium++;
    else brokerVCKMap[c.brokerName].low++;
    if (bought) brokerVCKMap[c.brokerName].bought++;
  });

  const brokerVCKList = Object.entries(brokerVCKMap)
    .map(([name, stats]) => {
      const total = stats.high + stats.medium + stats.low;
      return {
        name,
        ...stats,
        total,
        conversionRate: total > 0 ? Math.round((stats.bought / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.high - a.high);

  let totalHigh = 0, totalMedium = 0, totalLow = 0;
  let boughtHigh = 0, boughtMedium = 0, boughtLow = 0;
  vckAnalysisCustomers.forEach(c => {
    const score = scoreForVCK(c);
    const bought = hasAlreadyBought(c, score);
    if (score >= 70) {
      totalHigh++;
      if (bought) boughtHigh++;
    } else if (score >= 40) {
      totalMedium++;
      if (bought) boughtMedium++;
    } else {
      totalLow++;
      if (bought) boughtLow++;
    }
  });

  const brokerVCKStats = (() => {
    let high = 0, medium = 0, low = 0, bought = 0;
    vckAnalysisCustomers.forEach(c => {
      const score = scoreForVCK(c);
      const isBought = hasAlreadyBought(c, score);
      if (score >= 70) high++;
      else if (score >= 40) medium++;
      else low++;
      if (isBought) bought++;
    });
    const total = high + medium + low;
    return { high, medium, low, bought, total, conversionRate: total > 0 ? Math.round((bought / total) * 100) : 0 };
  })();

  const getRandomCompletion = () => Math.floor(80 + Math.random() * 31);

  const customerCompletion = Math.round((totalCustomers / targets.customerPlanTarget) * 100);
  const customerProjectedValue = calculateProjectedValue(totalCustomers, 12);
  const customerMissing = Math.max(0, targets.customerPlanTarget - totalCustomers);

  const activeCompletion = Math.round((activeCustomers / targets.activeCustomerPlanTarget) * 100);
  const activeProjectedValue = calculateProjectedValue(activeCustomers, 8);
  const activeMissing = Math.max(0, targets.activeCustomerPlanTarget - activeCustomers);

  const commissionCompletion = getRandomCompletion();
  const commissionProjectedValue = calculateProjectedValue(totalCommission, 15);
  const commissionMissing = Math.max(0, targets.commissionPlanTarget - totalCommission);

  const tradingValueCompletion = getRandomCompletion();
  const tradingValueProjectedValue = calculateProjectedValue(totalTradingValue, -5);
  const tradingValueMissing = Math.max(0, targets.tradingValuePlanTarget - totalTradingValue);

  const navCompletion = Math.round((totalNAV / targets.navPlanTarget) * 100);
  const navProjectedValue = calculateProjectedValue(totalNAV, 10);
  const navMissing = Math.max(0, targets.navPlanTarget - totalNAV);

  const aumCompletion = Math.round((totalAUM / targets.aumPlanTarget) * 100);
  const aumProjectedValue = calculateProjectedValue(totalAUM, 12);
  const aumMissing = Math.max(0, targets.aumPlanTarget - totalAUM);

  const staffCompletion = Math.round((staffCount / targets.staffPlanTarget) * 100);
  const staffProjectedValue = calculateProjectedValue(staffCount, 5);
  const staffMissing = Math.max(0, targets.staffPlanTarget - staffCount);

  const managerCustomerCompletion = Math.round((managerOwnCustomers / targets.managerCustomerPlanTarget) * 100);
  const managerCustomerProjectedValue = calculateProjectedValue(managerOwnCustomers, 8);
  const managerCustomerMissing = Math.max(0, targets.managerCustomerPlanTarget - managerOwnCustomers);

  const monthlyData = [
    { month: 'T7/24', revenue: 3200, customers: 140, orders: 320, churnRate: 3.2 },
    { month: 'T8/24', revenue: 2900, customers: 125, orders: 290, churnRate: 4.1 },
    { month: 'T9/24', revenue: 3800, customers: 155, orders: 385, churnRate: 2.8 },
    { month: 'T10/24', revenue: 5100, customers: 185, orders: 515, churnRate: 2.1 },
    { month: 'T11/24', revenue: 5800, customers: 205, orders: 585, churnRate: 1.8 },
    { month: 'T12/24', revenue: 8400, customers: 280, orders: 845, churnRate: 1.5 },
    { month: 'T1/25', revenue: 3600, customers: 135, orders: 362, churnRate: 4.2 },
    { month: 'T2/25', revenue: 4400, customers: 165, orders: 442, churnRate: 3.5 },
    { month: 'T3/25', revenue: 5200, customers: 190, orders: 524, churnRate: 2.9 },
    { month: 'T4/25', revenue: 4700, customers: 175, orders: 472, churnRate: 3.3 },
    { month: 'T5/25', revenue: 5600, customers: 200, orders: 562, churnRate: 2.4 },
    { month: 'T6/25', revenue: 6100, customers: 215, orders: 615, churnRate: 2.1 },
  ];

  const quarterlyData = [
    {
      month: 'Q3/24',
      revenue: monthlyData.slice(0, 3).reduce((sum, d) => sum + d.revenue, 0) / 3,
      customers: Math.round(monthlyData.slice(0, 3).reduce((sum, d) => sum + d.customers, 0) / 3),
      orders: Math.round(monthlyData.slice(0, 3).reduce((sum, d) => sum + d.orders, 0) / 3),
      churnRate: parseFloat((monthlyData.slice(0, 3).reduce((sum, d) => sum + d.churnRate, 0) / 3).toFixed(1)),
    },
    {
      month: 'Q4/24',
      revenue: monthlyData.slice(3, 6).reduce((sum, d) => sum + d.revenue, 0) / 3,
      customers: Math.round(monthlyData.slice(3, 6).reduce((sum, d) => sum + d.customers, 0) / 3),
      orders: Math.round(monthlyData.slice(3, 6).reduce((sum, d) => sum + d.orders, 0) / 3),
      churnRate: parseFloat((monthlyData.slice(3, 6).reduce((sum, d) => sum + d.churnRate, 0) / 3).toFixed(1)),
    },
    {
      month: 'Q1/25',
      revenue: monthlyData.slice(6, 9).reduce((sum, d) => sum + d.revenue, 0) / 3,
      customers: Math.round(monthlyData.slice(6, 9).reduce((sum, d) => sum + d.customers, 0) / 3),
      orders: Math.round(monthlyData.slice(6, 9).reduce((sum, d) => sum + d.orders, 0) / 3),
      churnRate: parseFloat((monthlyData.slice(6, 9).reduce((sum, d) => sum + d.churnRate, 0) / 3).toFixed(1)),
    },
    {
      month: 'Q2/25',
      revenue: monthlyData.slice(9, 12).reduce((sum, d) => sum + d.revenue, 0) / 3,
      customers: Math.round(monthlyData.slice(9, 12).reduce((sum, d) => sum + d.customers, 0) / 3),
      orders: Math.round(monthlyData.slice(9, 12).reduce((sum, d) => sum + d.orders, 0) / 3),
      churnRate: parseFloat((monthlyData.slice(9, 12).reduce((sum, d) => sum + d.churnRate, 0) / 3).toFixed(1)),
    },
  ];

  const yearlyData = [
    {
      month: '2024',
      revenue: monthlyData.slice(0, 6).reduce((sum, d) => sum + d.revenue, 0) / 6,
      customers: Math.round(monthlyData.slice(0, 6).reduce((sum, d) => sum + d.customers, 0) / 6),
      orders: Math.round(monthlyData.slice(0, 6).reduce((sum, d) => sum + d.orders, 0) / 6),
      churnRate: parseFloat((monthlyData.slice(0, 6).reduce((sum, d) => sum + d.churnRate, 0) / 6).toFixed(1)),
    },
    {
      month: '2025',
      revenue: monthlyData.slice(6, 12).reduce((sum, d) => sum + d.revenue, 0) / 6,
      customers: Math.round(monthlyData.slice(6, 12).reduce((sum, d) => sum + d.customers, 0) / 6),
      orders: Math.round(monthlyData.slice(6, 12).reduce((sum, d) => sum + d.orders, 0) / 6),
      churnRate: parseFloat((monthlyData.slice(6, 12).reduce((sum, d) => sum + d.churnRate, 0) / 6).toFixed(1)),
    },
  ];

  const chartData = periodFilter === 'month' ? monthlyData : periodFilter === 'quarter' ? quarterlyData : yearlyData;

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const peakMonth = chartData.find(d => d.revenue === maxRevenue)?.month;

  const CHART_BASE = '#9ca3af';
  const CHART_HIGHLIGHT = '#7c3aed';
  const AXIS_LABEL = '#cbd5e1';

  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.revenue === maxRevenue) {
      return (
        <g key={`peak-${cx}`}>
          <circle cx={cx} cy={cy} r={8} fill={CHART_HIGHLIGHT} stroke="white" strokeWidth={2} />
        </g>
      );
    }
    return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3} fill={CHART_BASE} />;
  };

  return (
    <div className="space-y-8">
      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'kpi'
              ? 'text-accent-600 dark:text-accent-400 border-accent-600 dark:border-accent-400'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Quản lý KPI
        </button>
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'recommendation'
              ? 'text-accent-600 dark:text-accent-400 border-accent-600 dark:border-accent-400'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Opportunities
        </button>
      </div>

      {/* KPI Tab Content */}
      {activeTab === 'kpi' && (
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
          icon={<TrendingUp size={24} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Doanh thu & Số lệnh giao dịch
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
              <XAxis dataKey="month" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} interval={1} />
              <YAxis stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#1f2937'
                }}
              />
              <Legend />
              <ReferenceLine
                x={peakMonth}
                stroke={CHART_HIGHLIGHT}
                strokeDasharray="4 4"
                label={{
                  value: `Đỉnh: ${maxRevenue} tỷ đ`,
                  position: 'top',
                  fill: CHART_HIGHLIGHT,
                  fontWeight: 'bold',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                strokeWidth={2}
                name="Doanh thu (tỷ đ)"
                dot={renderCustomDot}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#fbbf24"
                strokeWidth={2}
                name="Số lệnh"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Số lượng khách hàng Active & Churn Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
              <XAxis dataKey="month" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} interval={1} />
              <YAxis yAxisId="left" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#1f2937'
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="customers"
                stroke="#fbbf24"
                strokeWidth={2}
                name="Số khách hàng"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="churnRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="Churn Rate (%)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
      )}

      {/* Opportunities Tab Content */}
      {activeTab === 'recommendation' && (
      <div className="space-y-6">

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Báo cáo tiềm năng mua VCK
        </h2>

        {role === 'Manager' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase mb-2">
                  🟢 Cao
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalHigh} <span className="text-sm text-emerald-600 dark:text-emerald-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalHigh / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Đã mua: {boughtHigh} ({totalHigh > 0 ? Math.round((boughtHigh / totalHigh) * 100) : 0}%)</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-2">
                  🟡 Trung bình
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {totalMedium} <span className="text-sm text-amber-600 dark:text-amber-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalMedium / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Đã mua: {boughtMedium} ({totalMedium > 0 ? Math.round((boughtMedium / totalMedium) * 100) : 0}%)</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  ⬜ Thấp
                </p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {totalLow} <span className="text-sm text-gray-600 dark:text-gray-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalLow / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Đã mua: {boughtLow} ({totalLow > 0 ? Math.round((boughtLow / totalLow) * 100) : 0}%)</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-2">
                  ✅ Đã mua
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {boughtHigh + boughtMedium + boughtLow} <span className="text-sm text-blue-600 dark:text-blue-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
              </div>
            </div>

            {(totalHigh + totalMedium + totalLow) > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiến độ chuyển đổi VCK
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {boughtHigh + boughtMedium + boughtLow} / {totalHigh + totalMedium + totalLow} KH ({Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100)}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {role === 'Manager' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                So sánh tiến độ chuyển đổi VCK theo Broker
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {[...brokerVCKList].sort((a, b) => b.conversionRate - a.conversionRate).map(broker => {
                    const rate = broker.conversionRate;
                    const barColor = rate > 50 ? 'bg-emerald-500' : rate > 30 ? 'bg-blue-500' : rate > 15 ? 'bg-amber-500' : 'bg-red-500';
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 text-right shrink-0 w-28 truncate">{broker.name}</span>
                        <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-7 overflow-hidden">
                          <div
                            className={`${barColor} h-full rounded-full flex items-center px-2 transition-all duration-500`}
                            style={{ width: `${Math.max(rate, 5)}%` }}
                          >
                            <span className="text-white text-xs font-semibold whitespace-nowrap">{rate}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{broker.bought}/{broker.total}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {(
                    [
                      { label: 'Xuất sắc', threshold: '>50%',   check: (r: number) => r > 50,          bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', chip: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300' },
                      { label: 'Tốt',       threshold: '30–50%', check: (r: number) => r > 30 && r <= 50, bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',         text: 'text-blue-700 dark:text-blue-300',     chip: 'bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300' },
                      { label: 'Khá',       threshold: '15–30%', check: (r: number) => r > 15 && r <= 30, bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',       text: 'text-amber-700 dark:text-amber-300',   chip: 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300' },
                      { label: 'Cần cải thiện', threshold: '≤15%', check: (r: number) => r <= 15,          bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',             text: 'text-red-700 dark:text-red-300',       chip: 'bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300' },
                    ] as const
                  ).map(cat => {
                    const matched = brokerVCKList.filter(b => cat.check(b.conversionRate));
                    return (
                      <div key={cat.label} className={`${cat.bg} rounded-lg p-3 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${cat.text}`}>{cat.label} ({cat.threshold})</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.chip}`}>{matched.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matched.map(b => (
                            <span key={b.name} className={`text-xs px-2 py-0.5 rounded ${cat.chip}`}>{b.name}</span>
                          ))}
                          {matched.length === 0 && <span className="text-xs text-gray-400 italic">Không có</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            <div className="overflow-x-auto">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Phân tích chi tiết theo Broker</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Broker</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">🟢 Cao (≥70)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">🟡 TB (40-69)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">⬜ Thấp (&lt;40)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Tổng tiềm năng</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">✅ Đã mua</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Tỷ lệ</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {brokerVCKList.map(broker => (
                    <tr key={broker.name} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{broker.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded font-semibold">
                          {broker.high}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-semibold">
                          {broker.medium}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-semibold">
                          {broker.low}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                        {broker.total}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                        {broker.bought}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${broker.conversionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap w-10 text-right">
                            {broker.conversionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(() => {
                          const rate = broker.conversionRate;
                          if (rate > 50) {
                            return <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded text-xs font-semibold">Xuất sắc</span>;
                          } else if (rate > 30) {
                            return <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">Tốt</span>;
                          } else if (rate > 15) {
                            return <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 rounded text-xs font-semibold">Khá</span>;
                          } else {
                            return <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300 rounded text-xs font-semibold">Cần cải thiện</span>;
                          }
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {brokerVCKList.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Không có dữ liệu khách hàng tiềm năng.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase mb-2">
                  🟢 Cao
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {brokerVCKStats.high} <span className="text-sm text-emerald-600 dark:text-emerald-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.high / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-2">
                  🟡 Trung bình
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {brokerVCKStats.medium} <span className="text-sm text-amber-600 dark:text-amber-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.medium / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  ⬜ Thấp
                </p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {brokerVCKStats.low} <span className="text-sm text-gray-600 dark:text-gray-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.low / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-2">
                  ✅ Đã mua
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {brokerVCKStats.bought} <span className="text-sm text-blue-600 dark:text-blue-400">({brokerVCKStats.conversionRate}%)</span>
                </p>
              </div>
            </div>

            {brokerVCKStats.total > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiến độ chuyển đổi VCK
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {brokerVCKStats.bought} / {brokerVCKStats.total} KH ({brokerVCKStats.conversionRate}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${brokerVCKStats.conversionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
}
