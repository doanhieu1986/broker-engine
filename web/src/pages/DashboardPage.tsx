import { useState } from 'react';
import { StatCard } from '../components/shared/StatCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, Users, DollarSign, Zap, BarChart2, Briefcase, UserPlus, UserCheck, Building2 } from 'lucide-react';
import { mockCustomers, mockTransactions, mockBrokerChartData } from '../data/mockData';
import { useUser } from '../context/UserContext';

export function DashboardPage() {
  const { role } = useUser();
  const [kpiType, setKpiType] = useState<'company' | 'team'>('team');

  // Calculate summary metrics
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.activeStatus).length;
  const totalCommission = mockTransactions.reduce((sum, t) => sum + t.commission, 0);
  const totalTradingValue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Additional KPI metrics
  const totalNAV = mockCustomers.reduce((sum, c) => sum + c.nav, 0);
  const totalAUM = mockCustomers.reduce((sum, c) => sum + c.aum, 0);
  const staffCount = mockBrokerChartData.length;
  const managerOwnCustomers = Math.round(totalCustomers * 0.15);

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

  const customerCompletion = Math.round((totalCustomers / targets.customerPlanTarget) * 100);
  const customerProjectedValue = calculateProjectedValue(totalCustomers, 12);
  const customerMissing = Math.max(0, targets.customerPlanTarget - totalCustomers);

  const activeCompletion = Math.round((activeCustomers / targets.activeCustomerPlanTarget) * 100);
  const activeProjectedValue = calculateProjectedValue(activeCustomers, 8);
  const activeMissing = Math.max(0, targets.activeCustomerPlanTarget - activeCustomers);

  const commissionCompletion = Math.round((totalCommission / targets.commissionPlanTarget) * 100);
  const commissionProjectedValue = calculateProjectedValue(totalCommission, 15);
  const commissionMissing = Math.max(0, targets.commissionPlanTarget - totalCommission);

  const tradingValueCompletion = Math.round((totalTradingValue / targets.tradingValuePlanTarget) * 100);
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
  const topBrokersByRevenue = [...mockBrokerChartData]
    .sort((a, b) => b.hoaHong - a.hoaHong);

  const topBrokersByOrders = [...mockBrokerChartData]
    .sort((a, b) => b.soLenh - a.soLenh);

  const topBrokersByCustomers = [...mockBrokerChartData]
    .sort((a, b) => b.khachHang - a.khachHang);

  const topBrokersByMarginDebt = [...mockBrokerChartData]
    .sort((a, b) => b.duNoMargin - a.duNoMargin);

  // Chart data - 12 months with seasonal variation
  const monthlyData = [
    { month: 'T7/24', revenue: 3200, customers: 140, orders: 320 },
    { month: 'T8/24', revenue: 2900, customers: 125, orders: 290 },
    { month: 'T9/24', revenue: 3800, customers: 155, orders: 385 },
    { month: 'T10/24', revenue: 5100, customers: 185, orders: 515 },
    { month: 'T11/24', revenue: 5800, customers: 205, orders: 585 },
    { month: 'T12/24', revenue: 8400, customers: 280, orders: 845 },
    { month: 'T1/25', revenue: 3600, customers: 135, orders: 362 },
    { month: 'T2/25', revenue: 4400, customers: 165, orders: 442 },
    { month: 'T3/25', revenue: 5200, customers: 190, orders: 524 },
    { month: 'T4/25', revenue: 4700, customers: 175, orders: 472 },
    { month: 'T5/25', revenue: 5600, customers: 200, orders: 562 },
    { month: 'T6/25', revenue: 6100, customers: 215, orders: 615 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const peakMonth = monthlyData.find(d => d.revenue === maxRevenue)?.month;

  const maxCustomers = Math.max(...monthlyData.map(d => d.customers));

  // Classification distribution (VIP-dominant insight)
  const classificationData = [
    { name: 'VIP', value: 68 },
    { name: 'Mass', value: 42 },
    { name: 'Dormant', value: 25 },
    { name: 'Newbie', value: 15 },
  ];

  // Unified chart color scheme
  const CHART_BASE = '#9ca3af';
  const CHART_MUTED = '#cbd5e1';
  const CHART_LIGHT = '#e5e7eb';
  const CHART_HIGHLIGHT = '#7c3aed';
  const COLORS = [CHART_HIGHLIGHT, CHART_BASE, CHART_MUTED, CHART_LIGHT];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          value={(totalTradingValue / 1000000000).toFixed(2)}
          unit="tỷ đồng"
          icon={<Zap size={24} />}
          trend={-5}
          variant="accent"
          projectedValue={(tradingValueProjectedValue / 1000000000).toFixed(2)}
          currentNumericValue={totalTradingValue / 1000000000}
          projectedNumericValue={tradingValueProjectedValue / 1000000000}
          planCompletion={tradingValueCompletion}
          amountMissing={(tradingValueMissing / 1000000000).toFixed(2)}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue and Orders chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Doanh thu & Số lệnh giao dịch
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
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
                stroke={CHART_BASE}
                strokeWidth={2}
                name="Doanh thu (tỷ đ)"
                dot={renderCustomDot}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={CHART_MUTED}
                strokeWidth={2}
                name="Số lệnh"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Classification Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cơ cấu khách hàng
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {classificationData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value} khách hàng`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Số lượng khách hàng Active
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#1f2937'
              }}
            />
            <Legend />
            <Bar dataKey="customers" name="Số khách hàng">
              {monthlyData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.customers === maxCustomers ? CHART_HIGHLIGHT : CHART_BASE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manager-only: Broker Performance Charts */}
      {role === 'Manager' && (
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hiệu suất theo Broker (Top 10)
          </h2>

          {/* Row 1: Revenue and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Doanh thu phí hoa hồng môi giới theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
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
                    {topBrokersByRevenue.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Trading Orders Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Số lệnh giao dịch theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByOrders} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                  />
                  <Bar dataKey="soLenh" name="Số lệnh">
                    {topBrokersByOrders.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                    ))}
                  </Bar>
                </BarChart>
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
                <BarChart data={topBrokersByCustomers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                  />
                  <Bar dataKey="khachHang" name="KH mở mới">
                    {topBrokersByCustomers.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Margin Debt Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Dư nợ margin theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByMarginDebt} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(0)} tỷ đ` : ''}
                  />
                  <Bar dataKey="duNoMargin" name="Dư nợ margin (tỷ đ)">
                    {topBrokersByMarginDebt.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? CHART_HIGHLIGHT : CHART_BASE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
