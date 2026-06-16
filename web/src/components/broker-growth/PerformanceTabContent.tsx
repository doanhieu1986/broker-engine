import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockCustomers, mockTransactions, mockBrokerChartData } from '../../data/mockData';
import { useUser } from '../../context/UserContext';

export function PerformanceTabContent() {
  const { role, user } = useUser();
  const [performanceTab, setPerformanceTab] = useState<'brokers' | 'customers'>(role === 'Manager' ? 'brokers' : 'customers');

  // Helper function to get color based on completion percentage
  const getProgressBarColor = (completion: number): string => {
    if (completion >= 100) return 'bg-emerald-500';
    if (completion >= 80) return 'bg-blue-500';
    if (completion >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Colors for charts
  const CHART_BASE = '#9ca3af';
  const CHART_HIGHLIGHT = '#7c3aed';
  const AXIS_LABEL = '#cbd5e1';

  // Broker performance data with targets
  const topBrokersByRevenue = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.hoaHong,
      target: b.hoaHongKH,
      remaining: Math.max(0, b.hoaHongKH - b.hoaHong),
      completion: Math.round((b.hoaHong / b.hoaHongKH) * 100),
    }))
    .sort((a, b) => b.target - a.target);

  const topBrokersByOrders = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.soLenh,
      target: b.soLenhKH,
      remaining: Math.max(0, b.soLenhKH - b.soLenh),
      completion: Math.round((b.soLenh / b.soLenhKH) * 100),
    }))
    .sort((a, b) => b.target - a.target);

  const topBrokersByCustomers = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.khachHang,
      target: b.khachHangKH,
      remaining: Math.max(0, b.khachHangKH - b.khachHang),
      completion: Math.round((b.khachHang / b.khachHangKH) * 100),
    }))
    .sort((a, b) => b.target - a.target);

  const topBrokersByMarginDebt = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.duNoMargin,
      target: b.duNoMarginKH,
      remaining: Math.max(0, b.duNoMarginKH - b.duNoMargin),
      completion: Math.round((b.duNoMargin / b.duNoMarginKH) * 100),
    }))
    .sort((a, b) => b.target - a.target);

  // Customer performance data
  const filteredCustomers = role === 'Broker'
    ? mockCustomers.filter(c => c.brokerName === user.name)
    : mockCustomers;

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

      {/* Broker Performance Tab */}
      {performanceTab === 'brokers' && role === 'Manager' && (
        <div className="space-y-6">
          {/* Row 1: Revenue and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Revenue Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Doanh thu phí hoa hồng môi giới theo Broker
              </h3>
              <div className="space-y-4">
                {topBrokersByRevenue.map(broker => {
                  const rate = broker.completion;
                  const barColor = getProgressBarColor(rate);
                  const actualPct = (broker.actual / broker.target) * 100;
                  return (
                    <div key={broker.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{broker.name}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{broker.actual.toFixed(2)}B / {broker.target.toFixed(2)}B</span>
                      </div>
                      <div
                        className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-lg h-6 overflow-hidden cursor-help"
                        title={`Thực hiện: ${broker.actual.toFixed(2)}B | Kế hoạch: ${broker.target.toFixed(2)}B | Hoàn thành: ${rate}%`}
                      >
                        <div
                          className={`${barColor} h-full flex items-center px-2 transition-all duration-500 rounded-lg`}
                          style={{ width: `${Math.min(actualPct, 100)}%` }}
                        >
                          {actualPct >= 15 && <span className="text-white text-xs font-semibold">{rate}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Broker Trading Orders Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Số lệnh giao dịch theo Broker
              </h3>
              <div className="space-y-4">
                {topBrokersByOrders.map(broker => {
                  const rate = broker.completion;
                  const barColor = getProgressBarColor(rate);
                  const actualPct = (broker.actual / broker.target) * 100;
                  return (
                    <div key={broker.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{broker.name}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{broker.actual} / {broker.target}</span>
                      </div>
                      <div
                        className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-lg h-6 overflow-hidden cursor-help"
                        title={`Thực hiện: ${broker.actual} | Kế hoạch: ${broker.target} | Hoàn thành: ${rate}%`}
                      >
                        <div
                          className={`${barColor} h-full flex items-center px-2 transition-all duration-500 rounded-lg`}
                          style={{ width: `${Math.min(actualPct, 100)}%` }}
                        >
                          {actualPct >= 15 && <span className="text-white text-xs font-semibold">{rate}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Customers and Margin Debt */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Customers Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Số khách hàng theo Broker
              </h3>
              <div className="space-y-4">
                {topBrokersByCustomers.map(broker => {
                  const rate = broker.completion;
                  const barColor = getProgressBarColor(rate);
                  const actualPct = (broker.actual / broker.target) * 100;
                  return (
                    <div key={broker.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{broker.name}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{broker.actual} / {broker.target}</span>
                      </div>
                      <div
                        className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-lg h-6 overflow-hidden cursor-help"
                        title={`Thực hiện: ${broker.actual} | Kế hoạch: ${broker.target} | Hoàn thành: ${rate}%`}
                      >
                        <div
                          className={`${barColor} h-full flex items-center px-2 transition-all duration-500 rounded-lg`}
                          style={{ width: `${Math.min(actualPct, 100)}%` }}
                        >
                          {actualPct >= 15 && <span className="text-white text-xs font-semibold">{rate}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Margin Debt Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Dư nợ margin theo Broker
              </h3>
              <div className="space-y-4">
                {topBrokersByMarginDebt.map(broker => {
                  const rate = broker.completion;
                  const barColor = getProgressBarColor(rate);
                  const actualPct = (broker.actual / broker.target) * 100;
                  return (
                    <div key={broker.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{broker.name}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{broker.actual.toFixed(2)}B / {broker.target.toFixed(2)}B</span>
                      </div>
                      <div
                        className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-lg h-6 overflow-hidden cursor-help"
                        title={`Thực hiện: ${broker.actual.toFixed(2)}B | Kế hoạch: ${broker.target.toFixed(2)}B | Hoàn thành: ${rate}%`}
                      >
                        <div
                          className={`${barColor} h-full flex items-center px-2 transition-all duration-500 rounded-lg`}
                          style={{ width: `${Math.min(actualPct, 100)}%` }}
                        >
                          {actualPct >= 15 && <span className="text-white text-xs font-semibold">{rate}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Performance Tab */}
      {performanceTab === 'customers' && (
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
                    formatter={(value: any) => `${value} lệnh`}
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
                    formatter={(value: any) => `${value.toFixed(2)} tỷ đ`}
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
                    formatter={(value: any) => `${value.toFixed(2)} tỷ đ`}
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
      )}
    </div>
  );
}
