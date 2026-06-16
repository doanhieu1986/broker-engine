import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockCustomers, mockTransactions, mockBrokerChartData } from '../../data/mockData';
import { useUser } from '../../context/UserContext';

export function PerformanceTabContent() {
  const { role, user } = useUser();
  const [performanceTab, setPerformanceTab] = useState<'brokers' | 'customers'>(role === 'Manager' ? 'brokers' : 'customers');

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
    .sort((a, b) => b.actual - a.actual);

  const topBrokersByOrders = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.soLenh,
      target: b.soLenhKH,
      remaining: Math.max(0, b.soLenhKH - b.soLenh),
      completion: Math.round((b.soLenh / b.soLenhKH) * 100),
    }))
    .sort((a, b) => b.actual - a.actual);

  const topBrokersByCustomers = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.khachHang,
      target: b.khachHangKH,
      remaining: Math.max(0, b.khachHangKH - b.khachHang),
      completion: Math.round((b.khachHang / b.khachHangKH) * 100),
    }))
    .sort((a, b) => b.actual - a.actual);

  const topBrokersByMarginDebt = [...mockBrokerChartData]
    .map(b => ({
      ...b,
      actual: b.duNoMargin,
      target: b.duNoMarginKH,
      remaining: Math.max(0, b.duNoMarginKH - b.duNoMargin),
      completion: Math.round((b.duNoMargin / b.duNoMarginKH) * 100),
    }))
    .sort((a, b) => b.actual - a.actual);

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
              <div className="space-y-3">
                {(() => {
                  const maxTarget = Math.max(...topBrokersByRevenue.map(b => b.target));
                  return topBrokersByRevenue.map(broker => {
                    const targetPct = (broker.target / maxTarget) * 100;
                    const actualPct = (broker.actual / maxTarget) * 100;
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-32 truncate">{broker.name}</span>
                        <div className="flex-1 relative h-6 flex items-center cursor-help" title={`Thực hiện: ${broker.actual.toFixed(2)}B | Kế hoạch: ${broker.target.toFixed(2)}B | Còn thiếu: ${broker.remaining.toFixed(2)}B | Hoàn thành: ${broker.completion}%`}>
                          <div
                            className="bg-gray-300 dark:bg-slate-600 rounded-lg h-6 absolute left-0 top-0"
                            style={{ width: `${targetPct}%` }}
                          ></div>
                          <div
                            className="h-6 flex items-center px-2 rounded-lg relative z-10 transition-all duration-500"
                            style={{ width: `${actualPct}%`, backgroundColor: CHART_HIGHLIGHT }}
                          >
                            {actualPct >= 10 && <span className="text-white text-xs font-semibold truncate">{broker.actual.toFixed(2)}B</span>}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Broker Trading Orders Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Số lệnh giao dịch theo Broker
              </h3>
              <div className="space-y-3">
                {(() => {
                  const maxTarget = Math.max(...topBrokersByOrders.map(b => b.target));
                  return topBrokersByOrders.map(broker => {
                    const targetPct = (broker.target / maxTarget) * 100;
                    const actualPct = (broker.actual / maxTarget) * 100;
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-32 truncate">{broker.name}</span>
                        <div className="flex-1 relative h-6 flex items-center cursor-help" title={`Thực hiện: ${broker.actual} | Kế hoạch: ${broker.target} | Còn thiếu: ${broker.remaining} | Hoàn thành: ${broker.completion}%`}>
                          <div
                            className="bg-gray-300 dark:bg-slate-600 rounded-lg h-6 absolute left-0 top-0"
                            style={{ width: `${targetPct}%` }}
                          ></div>
                          <div
                            className="h-6 flex items-center px-2 rounded-lg relative z-10 transition-all duration-500"
                            style={{ width: `${actualPct}%`, backgroundColor: CHART_HIGHLIGHT }}
                          >
                            {actualPct >= 10 && <span className="text-white text-xs font-semibold truncate">{broker.actual}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
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
              <div className="space-y-3">
                {(() => {
                  const maxTarget = Math.max(...topBrokersByCustomers.map(b => b.target));
                  return topBrokersByCustomers.map(broker => {
                    const targetPct = (broker.target / maxTarget) * 100;
                    const actualPct = (broker.actual / maxTarget) * 100;
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-32 truncate">{broker.name}</span>
                        <div className="flex-1 relative h-6 flex items-center cursor-help" title={`Thực hiện: ${broker.actual} | Kế hoạch: ${broker.target} | Còn thiếu: ${broker.remaining} | Hoàn thành: ${broker.completion}%`}>
                          <div
                            className="bg-gray-300 dark:bg-slate-600 rounded-lg h-6 absolute left-0 top-0"
                            style={{ width: `${targetPct}%` }}
                          ></div>
                          <div
                            className="h-6 flex items-center px-2 rounded-lg relative z-10 transition-all duration-500"
                            style={{ width: `${actualPct}%`, backgroundColor: CHART_HIGHLIGHT }}
                          >
                            {actualPct >= 10 && <span className="text-white text-xs font-semibold truncate">{broker.actual}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Margin Debt Progress Bars */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Dư nợ margin theo Broker
              </h3>
              <div className="space-y-3">
                {(() => {
                  const maxTarget = Math.max(...topBrokersByMarginDebt.map(b => b.target));
                  return topBrokersByMarginDebt.map(broker => {
                    const targetPct = (broker.target / maxTarget) * 100;
                    const actualPct = (broker.actual / maxTarget) * 100;
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 w-32 truncate">{broker.name}</span>
                        <div className="flex-1 relative h-6 flex items-center cursor-help" title={`Thực hiện: ${broker.actual.toFixed(2)}B | Kế hoạch: ${broker.target.toFixed(2)}B | Còn thiếu: ${broker.remaining.toFixed(2)}B | Hoàn thành: ${broker.completion}%`}>
                          <div
                            className="bg-gray-300 dark:bg-slate-600 rounded-lg h-6 absolute left-0 top-0"
                            style={{ width: `${targetPct}%` }}
                          ></div>
                          <div
                            className="h-6 flex items-center px-2 rounded-lg relative z-10 transition-all duration-500"
                            style={{ width: `${actualPct}%`, backgroundColor: CHART_HIGHLIGHT }}
                          >
                            {actualPct >= 10 && <span className="text-white text-xs font-semibold truncate">{broker.actual.toFixed(2)}B</span>}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
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
                  <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(2)}B` : ''}
                  />
                  <Bar dataKey="hoaHong" name="Thực hiện" radius={[0, 8, 8, 0]}>
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
                  <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => `${value}`}
                  />
                  <Bar dataKey="soLenh" name="Thực hiện" radius={[0, 8, 8, 0]}>
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
                  <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => `${value.toFixed(2)}B`}
                  />
                  <Bar dataKey="nav" name="Thực hiện" radius={[0, 8, 8, 0]}>
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
                  <XAxis type="number" stroke={AXIS_LABEL} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke={AXIS_LABEL} width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => `${value.toFixed(2)}B`}
                  />
                  <Bar dataKey="aum" name="Thực hiện" radius={[0, 8, 8, 0]}>
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
