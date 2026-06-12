import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '../../context/UserContext';

type PeriodFilter = 'week' | 'month' | 'quarter' | 'year';
type ViewMode = 'company' | 'team';

// Mock data for different periods
const weekData = Array.from({ length: 52 }, (_, i) => ({
  period: `W${i + 1}`,
  customers: 900 + i * 10,
  active: 800 + i * 8,
  newCustomers: 20 + Math.floor(i / 4),
  nav: 350 + i * 10,
  tradingValue: 900 + i * 15,
  nộp: 40 + i,
  rút: 10 + Math.floor(i / 5),
  debt: 300 - i * 2,
}));

const monthData = [
  { period: 'T1', customers: 1100, active: 980, newCustomers: 45, nav: 450, tradingValue: 1200, nộp: 85, rút: 20, debt: 250 },
  { period: 'T2', customers: 1120, active: 1000, newCustomers: 50, nav: 480, tradingValue: 1350, nộp: 95, rút: 25, debt: 240 },
  { period: 'T3', customers: 1150, active: 1030, newCustomers: 55, nav: 520, tradingValue: 1450, nộp: 110, rút: 28, debt: 235 },
  { period: 'T4', customers: 1180, active: 1060, newCustomers: 48, nav: 550, tradingValue: 1380, nộp: 88, rút: 30, debt: 245 },
  { period: 'T5', customers: 1210, active: 1090, newCustomers: 60, nav: 590, tradingValue: 1520, nộp: 125, rút: 32, debt: 230 },
  { period: 'T6', customers: 1250, active: 1120, newCustomers: 65, nav: 630, tradingValue: 1650, nộp: 140, rút: 35, debt: 220 },
  { period: 'T7', customers: 1280, active: 1150, newCustomers: 58, nav: 670, tradingValue: 1580, nộp: 115, rút: 38, debt: 228 },
  { period: 'T8', customers: 1310, active: 1180, newCustomers: 72, nav: 710, tradingValue: 1720, nộp: 155, rút: 40, debt: 215 },
  { period: 'T9', customers: 1350, active: 1210, newCustomers: 68, nav: 760, tradingValue: 1850, nộp: 165, rút: 42, debt: 205 },
  { period: 'T10', customers: 1380, active: 1240, newCustomers: 75, nav: 800, tradingValue: 1920, nộp: 180, rút: 45, debt: 195 },
  { period: 'T11', customers: 1420, active: 1270, newCustomers: 82, nav: 850, tradingValue: 2050, nộp: 200, rút: 48, debt: 185 },
  { period: 'T12', customers: 1450, active: 1300, newCustomers: 88, nav: 900, tradingValue: 2150, nộp: 220, rút: 50, debt: 175 },
];

const quarterData = [
  { period: 'Q1', customers: 1120, active: 1003, newCustomers: 50, nav: 485, tradingValue: 1333, nộp: 96, rút: 25, debt: 242 },
  { period: 'Q2', customers: 1213, active: 1090, newCustomers: 61, nav: 590, tradingValue: 1517, nộp: 121, rút: 32, debt: 232 },
  { period: 'Q3', customers: 1313, active: 1180, newCustomers: 66, nav: 673, tradingValue: 1717, nộp: 128, rút: 40, debt: 224 },
  { period: 'Q4', customers: 1417, active: 1270, newCustomers: 82, nav: 850, tradingValue: 2050, nộp: 200, rút: 48, debt: 185 },
];

const yearData = [
  { period: '2024', customers: 1250, active: 1125, newCustomers: 65, nav: 635, tradingValue: 1650, nộp: 140, rút: 35, debt: 220 },
  { period: '2025', customers: 1417, active: 1270, newCustomers: 82, nav: 850, tradingValue: 2050, nộp: 200, rút: 48, debt: 175 },
];

const getChartData = (period: PeriodFilter) => {
  switch (period) {
    case 'week':
      return weekData;
    case 'month':
      return monthData;
    case 'quarter':
      return quarterData;
    case 'year':
      return yearData;
  }
};

export function DashboardTabContent() {
  const { role } = useUser();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('company');

  // Get data for current period filter
  const currentData = getChartData(periodFilter);
  const latestData = currentData[currentData.length - 1];
  const previousData = currentData[currentData.length - 2];

  // Calculate change percentage
  const calculatePercent = (current: number, previous: number): string => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const periodLabel = {
    week: 'Tuần',
    month: 'Tháng',
    quarter: 'Quý',
    year: 'Năm',
  } as const;

  const metrics = [
    {
      label: 'Khách hàng quản lý',
      value: latestData.customers,
      abbr: 'Khách hàng quản lý',
      color: 'from-blue-500 to-blue-600',
      percent: calculatePercent(latestData.customers, previousData.customers),
    },
    {
      label: 'Khách hàng active',
      value: latestData.active,
      abbr: 'Khách hàng mở mới',
      color: 'from-green-500 to-green-600',
      percent: calculatePercent(latestData.active, previousData.active),
    },
    {
      label: 'Khách hàng mở mới',
      value: latestData.newCustomers,
      abbr: 'Khách hàng mở mới',
      color: 'from-purple-500 to-purple-600',
      percent: calculatePercent(latestData.newCustomers, previousData.newCustomers),
    },
    {
      label: 'Sức mua',
      value: latestData.nav,
      unit: 'tỷ đồng',
      abbr: 'Sức mua',
      color: 'from-yellow-500 to-yellow-600',
      percent: calculatePercent(latestData.nav, previousData.nav),
    },
    {
      label: 'Tổng NAV',
      value: latestData.nav,
      unit: 'tỷ đồng',
      abbr: 'Tổng NAV',
      color: 'from-purple-500 to-purple-600',
      percent: calculatePercent(latestData.nav, previousData.nav),
    },
    {
      label: 'Giá trị giao dịch',
      value: latestData.tradingValue,
      unit: 'tỷ đồng',
      abbr: 'Giá trị giao dịch',
      color: 'from-orange-500 to-orange-600',
      percent: calculatePercent(latestData.tradingValue, previousData.tradingValue),
    },
    {
      label: 'Net (Nộp - Rút)',
      value: latestData.nộp - latestData.rút,
      unit: 'tỷ đồng',
      abbr: 'Net (Nộp - Rút)',
      color: 'from-green-500 to-green-600',
      percent: calculatePercent(latestData.nộp - latestData.rút, previousData.nộp - previousData.rút),
    },
    {
      label: 'Dư nợ',
      value: latestData.debt,
      unit: 'tỷ đồng',
      abbr: 'Dư nợ',
      color: 'from-red-500 to-red-600',
      percent: calculatePercent(latestData.debt, previousData.debt),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                periodFilter === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {periodLabel[period]}
            </button>
          ))}
        </div>

        {role === 'Manager' && (
          <div className="flex gap-2">
            {(['company', 'team'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {mode === 'company' ? 'Công ty' : 'Đội nhóm'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-8 gap-3">
        {metrics.map((metric) => {
          const isPositive = parseFloat(metric.percent) >= 0;
          const percentColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
          const percentBg = isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20';

          return (
            <div key={metric.label} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className={`px-2 py-1 rounded-md bg-gradient-to-br ${metric.color} text-white text-xs font-semibold whitespace-nowrap flex-shrink-0`}>
                  {metric.abbr}
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metric.value.toLocaleString()}
                  </p>
                  {metric.unit && <p className="text-xs text-gray-500 dark:text-gray-500">{metric.unit}</p>}
                </div>
                <div className={`px-1 py-0.5 rounded-full text-xs font-semibold ${percentBg} ${percentColor} flex-shrink-0`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(metric.percent))}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Khách hàng */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            👥 Khách hàng (Tổng, Active, Mới)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="customers" name="Tổng quản lý" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="active" name="Active" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="newCustomers" name="Mở mới" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: NAV & Giá trị giao dịch */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 Tổng NAV & Giá trị giao dịch
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" yAxisId="left" />
              <YAxis stroke="#9ca3af" yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="nav" name="NAV (tỷ đ)" stroke="#a855f7" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="tradingValue" name="Giá trị GD (tỷ đ)" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Net (Nộp - Rút) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💵 Net (Nộp tiền - Rút tiền)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="nộp" name="Nộp tiền (tỷ đ)" fill="#10b981" />
              <Bar dataKey="rút" name="Rút tiền (tỷ đ)" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Dư nợ */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📉 Tổng Dư nợ
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="debt" name="Dư nợ (tỷ đ)" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
