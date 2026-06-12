import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '../../context/UserContext';

type PeriodFilter = 'week' | 'month' | 'quarter' | 'year';
type ViewMode = 'company' | 'team';

// Mock data for different periods (with realistic fluctuations)
const weekData = Array.from({ length: 52 }, (_, i) => {
  const trend = Math.floor(i / 4) * 30;
  const wave = Math.sin((i * Math.PI) / 8) * 25;
  const noise = (Math.random() - 0.5) * 20;
  return {
    period: `W${i + 1}`,
    customers: 1100 + trend + wave + noise,
    active: 980 + Math.floor(trend * 0.85) + wave + noise,
    newCustomers: 45 + Math.floor(i / 6) + (Math.sin((i * Math.PI) / 10) * 15) + ((Math.random() - 0.5) * 10),
    nav: 450 + trend * 0.6 + wave + noise,
    tradingValue: 1200 + trend * 0.8 + wave * 1.2 + noise,
    nộp: 85 + Math.floor(i / 2) + (Math.sin((i * Math.PI) / 12) * 20) + ((Math.random() - 0.5) * 15),
    rút: 20 + Math.floor(i / 10) + (Math.sin((i * Math.PI) / 16) * 8) + ((Math.random() - 0.5) * 5),
    debt: 250 - Math.floor(i * 0.8) + (Math.sin((i * Math.PI) / 6) * 30) + ((Math.random() - 0.5) * 20),
  };
});

const monthData = [
  { period: 'T1', customers: 1100, active: 980, newCustomers: 45, nav: 450, tradingValue: 1200, nộp: 85, rút: 20, debt: 250 },
  { period: 'T2', customers: 1135, active: 1015, newCustomers: 52, nav: 485, tradingValue: 1380, nộp: 105, rút: 22, debt: 245 },
  { period: 'T3', customers: 1110, active: 1005, newCustomers: 48, nav: 470, tradingValue: 1320, nộp: 92, rút: 26, debt: 258 },
  { period: 'T4', customers: 1165, active: 1050, newCustomers: 58, nav: 520, tradingValue: 1480, nộp: 115, rút: 28, debt: 235 },
  { period: 'T5', customers: 1140, active: 1025, newCustomers: 62, nav: 500, tradingValue: 1420, nộp: 100, rút: 32, debt: 248 },
  { period: 'T6', customers: 1210, active: 1095, newCustomers: 68, nav: 580, tradingValue: 1650, nộp: 145, rút: 35, debt: 218 },
  { period: 'T7', customers: 1285, active: 1160, newCustomers: 65, nav: 640, tradingValue: 1720, nộp: 160, rút: 38, debt: 205 },
  { period: 'T8', customers: 1255, active: 1130, newCustomers: 75, nav: 610, tradingValue: 1580, nộp: 135, rút: 42, debt: 225 },
  { period: 'T9', customers: 1320, active: 1195, newCustomers: 70, nav: 710, tradingValue: 1850, nộp: 175, rút: 44, debt: 195 },
  { period: 'T10', customers: 1380, active: 1250, newCustomers: 80, nav: 800, tradingValue: 1920, nộp: 185, rút: 45, debt: 175 },
  { period: 'T11', customers: 1350, active: 1220, newCustomers: 85, nav: 770, tradingValue: 1850, nộp: 170, rút: 50, debt: 200 },
  { period: 'T12', customers: 1420, active: 1290, newCustomers: 92, nav: 850, tradingValue: 2000, nộp: 210, rút: 48, debt: 168 },
];

const quarterData = [
  { period: 'Q1', customers: 1115, active: 1000, newCustomers: 48, nav: 468, tradingValue: 1300, nộp: 94, rút: 23, debt: 251 },
  { period: 'Q2', customers: 1172, active: 1057, newCustomers: 63, nav: 533, tradingValue: 1517, nộp: 120, rút: 32, debt: 234 },
  { period: 'Q3', customers: 1287, active: 1162, newCustomers: 70, nav: 653, tradingValue: 1717, nộp: 157, rút: 41, debt: 208 },
  { period: 'Q4', customers: 1383, active: 1253, newCustomers: 86, nav: 807, tradingValue: 1923, nộp: 188, rút: 48, debt: 181 },
];

const yearData = [
  { period: '2024', customers: 1189, active: 1069, newCustomers: 61, nav: 540, tradingValue: 1483, nộp: 124, rút: 32, debt: 223 },
  { period: '2025', customers: 1354, active: 1208, newCustomers: 77, nav: 730, tradingValue: 1820, nộp: 173, rút: 45, debt: 197 },
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
