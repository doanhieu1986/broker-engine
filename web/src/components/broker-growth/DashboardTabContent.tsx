import { useState } from 'react';
import { Line, Bar, ComposedChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { useUser } from '../../context/UserContext';

type PeriodFilter = 'week' | 'month' | 'quarter' | 'year';
type ViewMode = 'company' | 'team';

// Mock data for different periods (with strong realistic fluctuations)
const weekData = Array.from({ length: 52 }, (_, i) => {
  const trend = Math.floor(i / 4) * 30;
  const wave = Math.sin((i * Math.PI) / 8) * 80;
  const noise = (Math.random() - 0.5) * 60;
  const customers = Math.round(1100 + trend + wave + noise);
  const active = Math.round(980 + Math.floor(trend * 0.85) + wave + noise);
  const tradingValue = Math.round(1200 + trend * 0.8 + wave * 1.2 + noise);
  const nav = Math.round(450 + trend * 0.6 + wave + noise);
  const debt = Math.round(250 - Math.floor(i * 0.8) + (Math.sin((i * Math.PI) / 6) * 80) + ((Math.random() - 0.5) * 60));
  const nộp = Math.round(85 + Math.floor(i / 2) + (Math.sin((i * Math.PI) / 12) * 50) + ((Math.random() - 0.5) * 40));
  const rút = Math.round(20 + Math.floor(i / 10) + (Math.sin((i * Math.PI) / 16) * 25) + ((Math.random() - 0.5) * 15));
  return {
    period: `W${i + 1}`,
    customers,
    active,
    inactive: customers - active,
    newCustomers: Math.round(45 + Math.floor(i / 6) + (Math.sin((i * Math.PI) / 10) * 40) + ((Math.random() - 0.5) * 30)),
    churn: Math.round((Math.sin((i * Math.PI) / 12) * 30)),
    nav,
    tradingValue,
    tradingValueBase: Math.round(tradingValue * 0.6),
    tradingValueDerivative: Math.round(tradingValue * 0.4),
    nộp,
    rút,
    net: nộp - rút,
    debt,
    debtToNavRatio: parseFloat(((debt / nav) * 100).toFixed(1)),
    commission: parseFloat((7.5 + trend * 0.05 + wave * 0.06 + ((Math.random() - 0.5) * 1.5)).toFixed(1)),
  };
});

const individualMonthData = [
  { period: 'T1', customers: 1100, active: 980, inactive: 120, newCustomers: 45, churn: 0, nav: 450, tradingValue: 1200, tradingValueBase: 720, tradingValueDerivative: 480, nộp: 85, rút: 20, net: 65, debt: 250, debtToNavRatio: 55.6, commission: 8.4 },
  { period: 'T2', customers: 1165, active: 1045, inactive: 120, newCustomers: 62, churn: -3, nav: 520, tradingValue: 1420, tradingValueBase: 852, tradingValueDerivative: 568, nộp: 125, rút: 18, net: 107, debt: 228, debtToNavRatio: 43.8, commission: 10.2 },
  { period: 'T3', customers: 1075, active: 960, inactive: 115, newCustomers: 38, churn: 128, nav: 420, tradingValue: 1280, tradingValueBase: 768, tradingValueDerivative: 512, nộp: 55, rút: 85, net: -30, debt: 275, debtToNavRatio: 65.5, commission: 8.9 },
  { period: 'T4', customers: 1220, active: 1100, inactive: 120, newCustomers: 75, churn: -70, nav: 580, tradingValue: 1580, tradingValueBase: 948, tradingValueDerivative: 632, nộp: 155, rút: 22, net: 133, debt: 210, debtToNavRatio: 36.2, commission: 11.6 },
  { period: 'T5', customers: 1090, active: 975, inactive: 115, newCustomers: 48, churn: 135, nav: 440, tradingValue: 1300, tradingValueBase: 780, tradingValueDerivative: 520, nộp: 70, rút: 95, net: -25, debt: 265, debtToNavRatio: 60.2, commission: 9.1 },
  { period: 'T6', customers: 1280, active: 1150, inactive: 130, newCustomers: 82, churn: -128, nav: 640, tradingValue: 1750, tradingValueBase: 1050, tradingValueDerivative: 700, nộp: 180, rút: 25, net: 155, debt: 185, debtToNavRatio: 28.9, commission: 13.2 },
  { period: 'T7', customers: 1340, active: 1210, inactive: 130, newCustomers: 88, churn: 28, nav: 720, tradingValue: 1850, tradingValueBase: 1110, tradingValueDerivative: 740, nộp: 200, rút: 30, net: 170, debt: 165, debtToNavRatio: 22.9, commission: 14.1 },
  { period: 'T8', customers: 1190, active: 1070, inactive: 120, newCustomers: 62, churn: 112, nav: 560, tradingValue: 1480, tradingValueBase: 888, tradingValueDerivative: 592, nộp: 95, rút: 120, net: -25, debt: 245, debtToNavRatio: 43.8, commission: 10.5 },
  { period: 'T9', customers: 1360, active: 1230, inactive: 130, newCustomers: 92, churn: -108, nav: 760, tradingValue: 1900, tradingValueBase: 1140, tradingValueDerivative: 760, nộp: 210, rút: 28, net: 182, debt: 155, debtToNavRatio: 20.4, commission: 14.6 },
  { period: 'T10', customers: 1420, active: 1290, inactive: 130, newCustomers: 105, churn: -130, nav: 850, tradingValue: 2000, tradingValueBase: 1200, tradingValueDerivative: 800, nộp: 235, rút: 35, net: 200, debt: 140, debtToNavRatio: 16.5, commission: 15.4 },
  { period: 'T11', customers: 1310, active: 1180, inactive: 130, newCustomers: 78, churn: 95, nav: 720, tradingValue: 1820, tradingValueBase: 1092, tradingValueDerivative: 728, nộp: 160, rút: 85, net: 75, debt: 210, debtToNavRatio: 29.2, commission: 13.7 },
  { period: 'T12', customers: 1480, active: 1340, inactive: 140, newCustomers: 112, churn: -97, nav: 920, tradingValue: 2100, tradingValueBase: 1260, tradingValueDerivative: 840, nộp: 255, rút: 32, net: 223, debt: 120, debtToNavRatio: 13.0, commission: 16.5 },
];

// Team data (100% higher than individual - 2x)
const teamMonthData = individualMonthData.map(d => ({
  ...d,
  customers: Math.round(d.customers * 2),
  active: Math.round(d.active * 2),
  inactive: Math.round(d.inactive * 2),
  newCustomers: Math.round(d.newCustomers * 2),
  churn: Math.round(d.churn * 2),
  nav: Math.round(d.nav * 2),
  tradingValue: Math.round(d.tradingValue * 2),
  tradingValueBase: Math.round(d.tradingValueBase * 2),
  tradingValueDerivative: Math.round(d.tradingValueDerivative * 2),
  nộp: Math.round(d.nộp * 2),
  rút: Math.round(d.rút * 2),
  net: Math.round(d.net * 2),
  debt: Math.round(d.debt * 2),
  debtToNavRatio: parseFloat((d.debtToNavRatio).toFixed(1)),
  commission: parseFloat((d.commission * 2).toFixed(1)),
}));

const monthData = individualMonthData;

// Team data for week
const weekTeamData = weekData.map(d => ({
  ...d,
  customers: Math.round(d.customers * 2),
  active: Math.round(d.active * 2),
  newCustomers: Math.round(d.newCustomers * 2),
  nav: Math.round(d.nav * 2),
  tradingValue: Math.round(d.tradingValue * 2),
  tradingValueBase: Math.round(d.tradingValueBase * 2),
  tradingValueDerivative: Math.round(d.tradingValueDerivative * 2),
  nộp: Math.round(d.nộp * 2),
  rút: Math.round(d.rút * 2),
  debt: Math.round(d.debt * 2),
  commission: parseFloat((d.commission * 2).toFixed(1)),
}));

const quarterData = [
  { period: 'Q1\'23', customers: 850, active: 765, inactive: 85, newCustomers: 28, churn: -28, nav: 320, tradingValue: 850, tradingValueBase: 510, tradingValueDerivative: 340, nộp: 58, rút: 15, net: 43, debt: 280, debtToNavRatio: 87.5, commission: 15.2 },
  { period: 'Q2\'23', customers: 920, active: 828, inactive: 92, newCustomers: 42, churn: 42, nav: 380, tradingValue: 1020, tradingValueBase: 612, tradingValueDerivative: 408, nộp: 78, rút: 18, net: 60, debt: 265, debtToNavRatio: 69.7, commission: 18.5 },
  { period: 'Q3\'23', customers: 995, active: 896, inactive: 99, newCustomers: 38, churn: -38, nav: 420, tradingValue: 1150, tradingValueBase: 690, tradingValueDerivative: 460, nộp: 95, rút: 22, net: 73, debt: 250, debtToNavRatio: 59.5, commission: 20.8 },
  { period: 'Q4\'23', customers: 1085, active: 977, inactive: 108, newCustomers: 55, churn: 55, nav: 480, tradingValue: 1280, tradingValueBase: 768, tradingValueDerivative: 512, nộp: 115, rút: 25, net: 90, debt: 230, debtToNavRatio: 47.9, commission: 23.6 },
  { period: 'Q1\'24', customers: 1113, active: 1001, inactive: 112, newCustomers: 48, churn: -48, nav: 463, tradingValue: 1300, tradingValueBase: 780, tradingValueDerivative: 520, nộp: 92, rút: 23, net: 69, debt: 251, debtToNavRatio: 54.2, commission: 27.5 },
  { period: 'Q2\'24', customers: 1197, active: 1075, inactive: 122, newCustomers: 68, churn: 68, nav: 560, tradingValue: 1573, tradingValueBase: 944, tradingValueDerivative: 629, nộp: 140, rút: 30, net: 110, debt: 220, debtToNavRatio: 39.3, commission: 33.9 },
  { period: 'Q3\'24', customers: 1297, active: 1173, inactive: 124, newCustomers: 81, churn: -81, nav: 680, tradingValue: 1750, tradingValueBase: 1050, tradingValueDerivative: 700, nộp: 173, rút: 35, net: 138, debt: 188, debtToNavRatio: 27.6, commission: 39.2 },
  { period: 'Q4\'24', customers: 1403, active: 1270, inactive: 133, newCustomers: 98, churn: 98, nav: 850, tradingValue: 2033, tradingValueBase: 1220, tradingValueDerivative: 813, nộp: 222, rút: 35, net: 187, debt: 143, debtToNavRatio: 16.8, commission: 45.6 },
  { period: 'Q1\'25', customers: 1468, active: 1321, inactive: 147, newCustomers: 76, churn: -76, nav: 920, tradingValue: 2150, tradingValueBase: 1290, tradingValueDerivative: 860, nộp: 245, rút: 32, net: 213, debt: 125, debtToNavRatio: 13.6, commission: 51.8 },
  { period: 'Q2\'25', customers: 1540, active: 1386, inactive: 154, newCustomers: 88, churn: 88, nav: 985, tradingValue: 2310, tradingValueBase: 1386, tradingValueDerivative: 924, nộp: 278, rút: 38, net: 240, debt: 110, debtToNavRatio: 11.2, commission: 56.4 },
  { period: 'Q3\'25', customers: 1618, active: 1456, inactive: 162, newCustomers: 102, churn: -102, nav: 1055, tradingValue: 2480, tradingValueBase: 1488, tradingValueDerivative: 992, nộp: 315, rút: 42, net: 273, debt: 95, debtToNavRatio: 9.0, commission: 61.5 },
  { period: 'Q4\'25', customers: 1703, active: 1532, inactive: 171, newCustomers: 120, churn: 120, nav: 1132, tradingValue: 2660, tradingValueBase: 1596, tradingValueDerivative: 1064, nộp: 355, rút: 48, net: 307, debt: 80, debtToNavRatio: 7.1, commission: 67.2 },
];

const yearData = [
  { period: '2021', customers: 650, active: 585, inactive: 65, newCustomers: 35, churn: 35, nav: 240, tradingValue: 620, tradingValueBase: 372, tradingValueDerivative: 248, nộp: 45, rút: 10, net: 35, debt: 320, debtToNavRatio: 133.3, commission: 42.5 },
  { period: '2022', customers: 750, active: 675, inactive: 75, newCustomers: 42, churn: -42, nav: 310, tradingValue: 820, tradingValueBase: 492, tradingValueDerivative: 328, nộp: 68, rút: 14, net: 54, debt: 300, debtToNavRatio: 96.8, commission: 58.2 },
  { period: '2023', customers: 950, active: 855, inactive: 95, newCustomers: 41, churn: 41, nav: 400, tradingValue: 1100, tradingValueBase: 660, tradingValueDerivative: 440, nộp: 86, rút: 20, net: 66, debt: 256, debtToNavRatio: 64.0, commission: 82.7 },
  { period: '2024', customers: 1202, active: 1078, inactive: 124, newCustomers: 74, churn: -74, nav: 590, tradingValue: 1604, tradingValueBase: 962, tradingValueDerivative: 642, nộp: 159, rút: 28, net: 131, debt: 205, debtToNavRatio: 34.7, commission: 146.2 },
  { period: '2025', customers: 1482, active: 1349, inactive: 133, newCustomers: 97, churn: 97, nav: 773, tradingValue: 2100, tradingValueBase: 1260, tradingValueDerivative: 840, nộp: 298, rút: 40, net: 258, debt: 102, debtToNavRatio: 13.2, commission: 237.1 },
];

// Team data for quarter
const quarterTeamData = quarterData.map(d => ({
  ...d,
  customers: Math.round(d.customers * 2),
  active: Math.round(d.active * 2),
  inactive: Math.round(d.inactive * 2),
  newCustomers: Math.round(d.newCustomers * 2),
  churn: Math.round(d.churn * 2),
  nav: Math.round(d.nav * 2),
  tradingValue: Math.round(d.tradingValue * 2),
  tradingValueBase: Math.round(d.tradingValueBase * 2),
  tradingValueDerivative: Math.round(d.tradingValueDerivative * 2),
  nộp: Math.round(d.nộp * 2),
  rút: Math.round(d.rút * 2),
  net: Math.round(d.net * 2),
  debt: Math.round(d.debt * 2),
  debtToNavRatio: parseFloat((d.debtToNavRatio).toFixed(1)),
  commission: parseFloat((d.commission * 2).toFixed(1)),
}));

// Team data for year
const yearTeamData = yearData.map(d => ({
  ...d,
  customers: Math.round(d.customers * 2),
  active: Math.round(d.active * 2),
  inactive: Math.round(d.inactive * 2),
  newCustomers: Math.round(d.newCustomers * 2),
  churn: Math.round(d.churn * 2),
  nav: Math.round(d.nav * 2),
  tradingValue: Math.round(d.tradingValue * 2),
  tradingValueBase: Math.round(d.tradingValueBase * 2),
  tradingValueDerivative: Math.round(d.tradingValueDerivative * 2),
  nộp: Math.round(d.nộp * 2),
  rút: Math.round(d.rút * 2),
  net: Math.round(d.net * 2),
  debt: Math.round(d.debt * 2),
  debtToNavRatio: parseFloat((d.debtToNavRatio).toFixed(1)),
  commission: parseFloat((d.commission * 2).toFixed(1)),
}));

const getChartData = (period: PeriodFilter, view: ViewMode = 'company') => {
  const data = (() => {
    switch (period) {
      case 'week':
        const weekSource = view === 'company' ? weekData : weekTeamData;
        return weekSource.slice(-12);
      case 'month':
        return view === 'company' ? monthData : teamMonthData;
      case 'quarter':
        const quarterSource = view === 'company' ? quarterData : quarterTeamData;
        return quarterSource.slice(-12);
      case 'year':
        const yearSource = view === 'company' ? yearData : yearTeamData;
        return yearSource.slice(-5);
    }
  })();
  return data;
};

export function DashboardTabContent() {
  const { role } = useUser();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('company');

  // Get data for current period filter and view mode
  const currentData = getChartData(periodFilter, viewMode);
  const latestData = currentData[currentData.length - 1];
  const previousData = currentData[currentData.length - 2];

  // Hybrid Net chart data: diverging bars (Nộp up, Rút down) + Net trend line.
  // - rútNeg: withdrawals rendered as negative so the red bar grows downward.
  // - net: the full Net value drawn as a single line, color-coded by sign via
  //   an SVG gradient (green above the zero line, red below it).
  const netChartData = currentData.map((d: any) => ({
    period: d.period,
    nộp: d.nộp,
    rút: d.rút,
    rútNeg: -d.rút,
    net: d.net,
  }));

  // Where does y=0 sit within the chart's value range? The Net line gradient
  // switches colour at this fractional offset so the boundary lands exactly on
  // the zero line regardless of the data. The chart's range is driven by the
  // bars (nộp up, rútNeg down), so include those in the bounds.
  const netValues = netChartData.flatMap((d) => [d.nộp, d.rútNeg, d.net]);
  const netMax = Math.max(0, ...netValues);
  const netMin = Math.min(0, ...netValues);
  const netZeroOffset =
    netMax === netMin ? 0.5 : netMax / (netMax - netMin);

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
      label: 'Tổng phí giao dịch',
      value: latestData.commission,
      unit: 'tỷ đồng',
      abbr: 'Tổng phí giao dịch',
      color: 'from-teal-500 to-teal-600',
      percent: calculatePercent(latestData.commission, previousData.commission),
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
                {mode === 'company' ? 'Cá nhân' : 'Team'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Bar - compact horizontal layout matching Market Indices style */}
      <div className="bg-gradient-to-r from-blue-900/20 via-slate-800/20 to-blue-900/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-xs">
          {metrics.map((metric) => {
            const isPositive = parseFloat(metric.percent) >= 0;
            const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

            return (
              <span key={metric.label} className="text-gray-900 dark:text-white whitespace-nowrap">
                <span className="text-gray-500 dark:text-gray-400">{metric.label}:</span>{' '}
                <span className="font-bold">
                  {metric.value.toLocaleString()}
                  {metric.unit ? ` ${metric.unit}` : ''}
                </span>{' '}
                <span className={changeColor}>
                  {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(metric.percent))}%
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Khách hàng */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            👥 Khách hàng (Active & Inactive & Mở mới)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={currentData}>
              <XAxis dataKey="period" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" stackId="customers" dataKey="active" name="Khách hàng Active" fill="#10b981" />
              <Bar yAxisId="left" stackId="customers" dataKey="inactive" name="Khách hàng Inactive" fill="#ef4444" />
              <Line yAxisId="right" type="monotone" dataKey="customers" name="Tổng quản lý" stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="newCustomers" name="Khách hàng mở mới" stroke="#fbbf24" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: NAV & Tổng Dư nợ */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 NAV & Tổng Dư nợ
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={currentData}>
              <XAxis dataKey="period" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="nav" name="NAV (tỷ đ)" fill="#10b981" />
              <Bar yAxisId="left" dataKey="debt" name="Tổng dư nợ (tỷ đ)" fill="#ef4444" />
              <Line yAxisId="right" type="monotone" dataKey="debtToNavRatio" name="Tỷ lệ Dư nợ/NAV (%)" stroke="#fbbf24" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Net (Nộp - Rút) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-6 px-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💵 Net (Nộp tiền - Rút tiền)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={netChartData} stackOffset="sign" margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                {/* Net line colour: green above the zero line, red below it.
                    The hard colour switch is placed at netZeroOffset so it
                    aligns exactly with y=0. */}
                <linearGradient id="netLineStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={netZeroOffset} stopColor="#10b981" />
                  <stop offset={netZeroOffset} stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[-300, 300]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value, name) => {
                  const num = typeof value === 'number' ? value : Number(value);
                  // Show the withdrawal bar as its real positive magnitude.
                  if (name === 'Rút tiền (tỷ đ)') return [Math.abs(num), name];
                  return [num, name as string];
                }}
              />
              <Legend wrapperStyle={{ color: '#e5e7eb', fontSize: '12px' }} verticalAlign="bottom" align="center" height={48} />
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={2} />
              {/* Diverging/overlapping bars (chồng lên nhau): both bars share the
                  same stackId and stackOffset="sign" makes positive values stack
                  UP and negative values stack DOWN from the y=0 line. Since one is
                  positive (nộp) and the other negative (rútNeg), they originate
                  from the same x position and diverge in opposite directions. */}
              <Bar
                stackId="net"
                dataKey="nộp"
                name="Nộp tiền (tỷ đ)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={28}
                fillOpacity={0.9}
              >
                <LabelList
                  dataKey="nộp"
                  position="top"
                  fill="#10b981"
                  fontSize={12}
                  formatter={(value) => Math.round(Number(value)).toString()}
                />
              </Bar>
              <Bar
                stackId="net"
                dataKey="rútNeg"
                name="Rút tiền (tỷ đ)"
                fill="#ef4444"
                radius={[0, 0, 4, 4]}
                barSize={28}
                fillOpacity={0.9}
              >
                <LabelList
                  dataKey="rútNeg"
                  position="top"
                  fill="#ef4444"
                  fontSize={12}
                  formatter={(value) => Math.round(Number(value)).toString()}
                />
              </Bar>
              {/* Net trend: a single smooth line over the bars, no fill.
                  Colour is green above 0 / red below 0 via the gradient stroke,
                  so the bars stay fully visible underneath. */}
              <Line type="monotone" dataKey="net" name="Net (tỷ đ)" stroke="url(#netLineStroke)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} legendType="plainline" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Giá trị giao dịch - Cơ sở & Phái sinh */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Giá trị giao dịch - Cơ sở & Phái sinh
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={currentData}>
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="tradingValueBase" name="Giá trị GD Cơ sở (tỷ đ)" fill="#10b981" />
              <Bar dataKey="tradingValueDerivative" name="Giá trị GD Phái sinh (tỷ đ)" fill="#ef4444" />
              <Line type="monotone" dataKey="tradingValue" name="Tổng GD (tỷ đ)" stroke="#fbbf24" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
