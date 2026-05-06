import { useState } from 'react';
import { StatCard } from '../components/shared/StatCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, Users, DollarSign, Zap, BarChart2, Briefcase, UserPlus, UserCheck, Building2 } from 'lucide-react';
import { mockCustomers, mockTransactions, mockBrokerChartData, mockStaff } from '../data/mockData';
import { useUser } from '../context/UserContext';

// Format large numbers as compact notation (e.g., 76000 -> "76K", 76560 -> "76.56K")
const formatCompactNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

export function DashboardPage() {
  const { role, user } = useUser();
  const [kpiType, setKpiType] = useState<'company' | 'team'>('team');
  const [performanceTab, setPerformanceTab] = useState<'customers' | 'brokers'>(
    role === 'Manager' ? 'brokers' : 'customers'
  );
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('month');

  // Calculate summary metrics
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.activeStatus).length;
  const totalCommission = mockTransactions.reduce((sum, t) => sum + t.commission, 0);
  const totalTradingValue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Additional KPI metrics
  const totalNAV = mockCustomers.reduce((sum, c) => sum + c.nav, 0);
  const totalAUM = mockCustomers.reduce((sum, c) => sum + c.aum, 0);

  // Get staff and customers for current user
  const userStaff = mockStaff.filter(s => s.brokerCode === user.brokerCode);
  const userCustomers = mockCustomers.filter(c => c.brokerCode === user.brokerCode);

  // For Manager: staffCount = number of managed brokers; For Broker: staffCount = number of staff
  const staffCount = role === 'Manager' ? (user.managedBrokerCodes?.length || 0) : userStaff.length;
  const managerOwnCustomers = userCustomers.length;

  // Plan targets and calculations
  // Helper function to calculate projected value based on trend
  const calculateProjectedValue = (currentValue: number, trendPercent: number): number => {
    return Math.round(currentValue * (1 + trendPercent / 100));
  };

  // Plan targets for Company and Team
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

  // Helper to generate random plan completion between 80-110%
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

  // Top brokers data for manager view
  // Period multiplier for broker data aggregation
  const periodMultiplier = periodFilter === 'month' ? 1 : periodFilter === 'quarter' ? 3 : 6;
  const brokerDataByPeriod = mockBrokerChartData.map(broker => ({
    ...broker,
    hoaHong: Math.round(broker.hoaHong * periodMultiplier),
    soLenh: Math.round(broker.soLenh * periodMultiplier),
    khachHang: Math.round(broker.khachHang * periodMultiplier),
    duNoMargin: Math.round(broker.duNoMargin * periodMultiplier),
    hoaHongKH: Math.round(broker.hoaHongKH * periodMultiplier),
    soLenhKH: Math.round(broker.soLenhKH * periodMultiplier),
    khachHangKH: Math.round(broker.khachHangKH * periodMultiplier),
    duNoMarginKH: Math.round(broker.duNoMarginKH * periodMultiplier),
  }));

  const topBrokersByRevenue = [...brokerDataByPeriod]
    .sort((a, b) => b.hoaHong - a.hoaHong);

  const topBrokersByOrders = [...brokerDataByPeriod]
    .sort((a, b) => b.soLenh - a.soLenh);

  const topBrokersByCustomers = [...brokerDataByPeriod]
    .sort((a, b) => b.khachHang - a.khachHang);

  const topBrokersByMarginDebt = [...brokerDataByPeriod]
    .sort((a, b) => b.duNoMargin - a.duNoMargin);

  // Chart data - 12 months with seasonal variation
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

  // Transform data based on period filter
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

  // Select data based on period filter
  const chartData = periodFilter === 'month' ? monthlyData : periodFilter === 'quarter' ? quarterlyData : yearlyData;

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const peakMonth = chartData.find(d => d.revenue === maxRevenue)?.month;

  // Unified chart color scheme
  const CHART_BASE = '#9ca3af';
  const CHART_LIGHT = '#e5e7eb';
  const CHART_HIGHLIGHT = '#7c3aed';
  const AXIS_LABEL = '#cbd5e1';

  // Custom dot renderer for peak revenue highlighting
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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-accent-100 text-lg">Tổng quan chỉ số kinh doanh và hiệu suất hàng tháng</p>
        </div>
      </div>

      {/* KPI Type Segment Control */}
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

      {/* KPI Cards */}
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

      {/* Period Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriodFilter('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'month'
              ? 'bg-accent-500 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Tháng
        </button>
        <button
          onClick={() => setPeriodFilter('quarter')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'quarter'
              ? 'bg-accent-500 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Quý
        </button>
        <button
          onClick={() => setPeriodFilter('year')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'year'
              ? 'bg-accent-500 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Năm
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue and Orders chart */}
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

        {/* Active Customers chart with Churn Rate */}
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

      {/* Manager & Broker: Performance Section with Tabs */}
      {(role === 'Manager' || role === 'Broker') && (
        <div className="space-y-6 pt-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
            {role === 'Manager' && (
              <button
                onClick={() => setPerformanceTab('brokers')}
                className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                  performanceTab === 'brokers'
                    ? 'border-accent-600 text-accent-600 dark:text-accent-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Hiệu suất theo Broker (Top 10)
              </button>
            )}
            <button
              onClick={() => setPerformanceTab('customers')}
              className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                performanceTab === 'customers'
                  ? 'border-accent-600 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Hiệu suất theo khách hàng (Top 10)
            </button>
          </div>

          {/* Customer Performance Tab */}
          {performanceTab === 'customers' && (
            <div className="space-y-6">
              {(() => {
                // Filter customers based on role
                const filteredCustomers = role === 'Broker'
                  ? mockCustomers.filter(c => c.brokerName === user.name)
                  : mockCustomers;

                // Calculate customer performance metrics
                const customerMetrics = filteredCustomers.map(customer => {
                  const customerTransactions = mockTransactions.filter(t => t.customerId === customer.id);
                  const totalCommissionCustomer = customerTransactions.reduce((sum, t) => sum + t.commission, 0);
                  const totalTradingValueCustomer = customerTransactions.reduce((sum, t) => sum + t.amount, 0);

                  return {
                    name: customer.name,
                    hoaHong: totalCommissionCustomer / 1000000000,
                    soLenh: customerTransactions.length,
                    nav: customer.nav / 1000000000,
                    aum: customer.aum / 1000000000,
                    giaTriGiaoDich: totalTradingValueCustomer / 1000000000,
                  };
                });

                const topCustomersByRevenue = [...customerMetrics].sort((a, b) => b.hoaHong - a.hoaHong).slice(0, 10);
                const topCustomersByOrders = [...customerMetrics].sort((a, b) => b.soLenh - a.soLenh).slice(0, 10);
                const topCustomersByNav = [...customerMetrics].sort((a, b) => b.nav - a.nav).slice(0, 10);
                const topCustomersByAum = [...customerMetrics].sort((a, b) => b.aum - a.aum).slice(0, 10);

                return (
                  <div className="space-y-6">
                    {/* Row 1: Revenue and Orders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Revenue Chart */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Doanh thu phí hoa hồng theo khách hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topCustomersByRevenue} layout="vertical">
                            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                            <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                color: '#1f2937'
                              }}
                              formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(2)} tỷ đ` : ''}
                            />
                            <Bar dataKey="hoaHong" name="Hoa hồng (tỷ đ)">
                              {topCustomersByRevenue.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Customer Trading Orders Chart */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Số lệnh giao dịch theo khách hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topCustomersByOrders} layout="vertical">
                            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                            <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                color: '#1f2937'
                              }}
                            />
                            <Bar dataKey="soLenh" name="Số lệnh">
                              {topCustomersByOrders.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Row 2: NAV and AUM */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer NAV Chart */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          NAV theo khách hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topCustomersByNav} layout="vertical">
                            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                            <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                color: '#1f2937'
                              }}
                              formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)} tỷ đ` : ''}
                            />
                            <Bar dataKey="nav" name="NAV (tỷ đ)">
                              {topCustomersByNav.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Customer AUM Chart */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          AUM theo khách hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topCustomersByAum} layout="vertical">
                            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                            <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                color: '#1f2937'
                              }}
                              formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)} tỷ đ` : ''}
                            />
                            <Bar dataKey="aum" name="AUM (tỷ đ)">
                              {topCustomersByAum.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Broker Performance Tab - Manager only */}
          {performanceTab === 'brokers' && role === 'Manager' && (
            <div className="space-y-6">
              {/* Row 1: Revenue and Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Doanh thu phí hoa hồng môi giới theo Broker
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {(() => {
                      const chartData = topBrokersByRevenue.map(b => ({
                        ...b,
                        actual: Math.min(b.hoaHong, b.hoaHongKH),
                        gap: Math.max(0, b.hoaHongKH - b.hoaHong),
                        completion: Math.round((b.hoaHong / b.hoaHongKH) * 100),
                      }));
                      return (
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              color: '#1f2937'
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'Còn lại (KH)') return '';
                              return typeof value === 'number' ? `${value.toFixed(2)} tỷ đ` : '';
                            }}
                            labelFormatter={(label) => {
                              const entry = chartData.find(d => d.name === label);
                              if (entry) return `${entry.name} - ${entry.completion}% KH`;
                              return label;
                            }}
                          />
                          <Bar dataKey="actual" stackId="a" name="Thực hiện" fill={CHART_HIGHLIGHT} />
                          <Bar dataKey="gap" stackId="a" name="Còn lại (KH)" fill={CHART_LIGHT} />
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>

                {/* Trading Orders Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Số lệnh giao dịch theo Broker
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {(() => {
                      const chartData = topBrokersByOrders.map(b => ({
                        ...b,
                        actual: Math.min(b.soLenh, b.soLenhKH),
                        gap: Math.max(0, b.soLenhKH - b.soLenh),
                        completion: Math.round((b.soLenh / b.soLenhKH) * 100),
                      }));
                      return (
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              color: '#1f2937'
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'Còn lại (KH)') return '';
                              return typeof value === 'number' ? `${value} lệnh` : '';
                            }}
                            labelFormatter={(label) => {
                              const entry = chartData.find(d => d.name === label);
                              if (entry) return `${entry.name} - ${entry.completion}% KH`;
                              return label;
                            }}
                          />
                          <Bar dataKey="actual" stackId="a" name="Thực hiện" fill={CHART_HIGHLIGHT} />
                          <Bar dataKey="gap" stackId="a" name="Còn lại (KH)" fill={CHART_LIGHT} />
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 2: New Customers and Margin Debt */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Customers Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Số lượng khách hàng mở mới theo Broker
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {(() => {
                      const chartData = topBrokersByCustomers.map(b => ({
                        ...b,
                        actual: Math.min(b.khachHang, b.khachHangKH),
                        gap: Math.max(0, b.khachHangKH - b.khachHang),
                        completion: Math.round((b.khachHang / b.khachHangKH) * 100),
                      }));
                      return (
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              color: '#1f2937'
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'Còn lại (KH)') return '';
                              return typeof value === 'number' ? `${value} khách` : '';
                            }}
                            labelFormatter={(label) => {
                              const entry = chartData.find(d => d.name === label);
                              if (entry) return `${entry.name} - ${entry.completion}% KH`;
                              return label;
                            }}
                          />
                          <Bar dataKey="actual" stackId="a" name="Thực hiện" fill={CHART_HIGHLIGHT} />
                          <Bar dataKey="gap" stackId="a" name="Còn lại (KH)" fill={CHART_LIGHT} />
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>

                {/* Margin Debt Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Dư nợ margin theo Broker
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {(() => {
                      const chartData = topBrokersByMarginDebt.map(b => ({
                        ...b,
                        actual: Math.min(b.duNoMargin, b.duNoMarginKH),
                        gap: Math.max(0, b.duNoMarginKH - b.duNoMargin),
                        completion: Math.round((b.duNoMargin / b.duNoMarginKH) * 100),
                      }));
                      return (
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              color: '#1f2937'
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'Còn lại (KH)') return '';
                              return typeof value === 'number' ? `${value.toFixed(0)} tỷ đ` : '';
                            }}
                            labelFormatter={(label) => {
                              const entry = chartData.find(d => d.name === label);
                              if (entry) return `${entry.name} - ${entry.completion}% KH`;
                              return label;
                            }}
                          />
                          <Bar dataKey="actual" stackId="a" name="Thực hiện" fill={CHART_HIGHLIGHT} />
                          <Bar dataKey="gap" stackId="a" name="Còn lại (KH)" fill={CHART_LIGHT} />
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
