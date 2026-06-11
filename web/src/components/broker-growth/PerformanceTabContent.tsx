import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockPerformanceReports, mockCustomers, mockTransactions, mockBrokerChartData } from '../../data/mockData';
import { DataTable } from '../shared/DataTable';
import { useUser } from '../../context/UserContext';

export function PerformanceTabContent() {
  const { role, user } = useUser();
  const [performanceTab, setPerformanceTab] = useState<'overview' | 'brokers' | 'customers'>('overview');

  const columns = [
    {
      key: 'brokerName',
      label: 'Broker',
      sortable: true,
    },
    {
      key: 'newAccountsOpened',
      label: 'Tài khoản mới',
      sortable: true,
    },
    {
      key: 'totalCommission',
      label: 'Hoa hồng (tỷ đ)',
      sortable: true,
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
    {
      key: 'totalOrders',
      label: 'Số lệnh',
      sortable: true,
    },
    {
      key: 'activeAccountsRatio',
      label: 'Tài khoản active (%)',
      sortable: true,
      render: (value: number) => value.toFixed(2),
    },
    {
      key: 'tradingFrequency',
      label: 'Tần suất giao dịch',
      sortable: true,
      render: (value: number) => value.toFixed(2),
    },
  ];

  // Colors for charts
  const CHART_BASE = '#9ca3af';
  const CHART_HIGHLIGHT = '#7c3aed';
  const AXIS_LABEL = '#cbd5e1';

  // Broker performance data with targets
  const topBrokersByRevenue = [...mockBrokerChartData]
    .sort((a, b) => b.hoaHong - a.hoaHong)
    .map(b => ({
      ...b,
      actual: Math.min(b.hoaHong, b.hoaHongKH),
      gap: Math.max(0, b.hoaHongKH - b.hoaHong),
      completion: Math.round((b.hoaHong / b.hoaHongKH) * 100),
    }));

  const topBrokersByOrders = [...mockBrokerChartData]
    .sort((a, b) => b.soLenh - a.soLenh)
    .map(b => ({
      ...b,
      actual: Math.min(b.soLenh, b.soLenhKH),
      gap: Math.max(0, b.soLenhKH - b.soLenh),
      completion: Math.round((b.soLenh / b.soLenhKH) * 100),
    }));

  const topBrokersByCustomers = [...mockBrokerChartData]
    .sort((a, b) => b.khachHang - a.khachHang)
    .map(b => ({
      ...b,
      actual: Math.min(b.khachHang, b.khachHangKH),
      gap: Math.max(0, b.khachHangKH - b.khachHang),
      completion: Math.round((b.khachHang / b.khachHangKH) * 100),
    }));

  const topBrokersByMarginDebt = [...mockBrokerChartData]
    .sort((a, b) => b.duNoMargin - a.duNoMargin)
    .map(b => ({
      ...b,
      actual: Math.min(b.duNoMargin, b.duNoMarginKH),
      gap: Math.max(0, b.duNoMarginKH - b.duNoMargin),
      completion: Math.round((b.duNoMargin / b.duNoMarginKH) * 100),
    }));

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
        <button
          onClick={() => setPerformanceTab('overview')}
          className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
            performanceTab === 'overview'
              ? 'border-accent-600 text-accent-600 dark:text-accent-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Tổng quan
        </button>
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

      {/* Overview Tab */}
      {performanceTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Table */}
      <DataTable
        title="Chi tiết hiệu suất từng broker"
        columns={columns}
        data={mockPerformanceReports}
        searchFields={['brokerName']}
        onExport={() => alert('Export feature coming soon')}
      />
        </div>
      )}

      {/* Broker Performance Tab */}
      {performanceTab === 'brokers' && role === 'Manager' && (
        <div className="space-y-6">
          {/* Row 1: Revenue and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Revenue Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Doanh thu phí hoa hồng môi giới theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByRevenue} layout="vertical">
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
                    formatter={(value: any, name: any) => {
                      if (name === 'Còn lại (KH)') return '';
                      return typeof value === 'number' ? `${(value / 1000000000).toFixed(2)} tỷ đ` : '';
                    }}
                    labelFormatter={(label: any) => {
                      const broker = topBrokersByRevenue.find((b: any) => b.name === label);
                      return broker ? `${broker.name} - ${broker.completion}%` : label;
                    }}
                  />
                  <Bar dataKey="hoaHong" name="Doanh thu thực tế" stackId="revenue" fill="#3b82f6" />
                  <Bar dataKey="gap" name="Còn lại (KH)" stackId="revenue" fill="#d1d5db" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Broker Trading Orders Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Số lệnh giao dịch theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByOrders} layout="vertical">
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
                    formatter={(value: any, name: any) => {
                      if (name === 'Còn lại (KH)') return '';
                      return `${value} lệnh`;
                    }}
                    labelFormatter={(label: any) => {
                      const broker = topBrokersByOrders.find((b: any) => b.name === label);
                      return broker ? `${broker.name} - ${broker.completion}%` : label;
                    }}
                  />
                  <Bar dataKey="soLenh" name="Lệnh thực tế" stackId="orders" fill="#10b981" />
                  <Bar dataKey="gap" name="Còn lại (KH)" stackId="orders" fill="#d1d5db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Customers and Margin Debt */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Customers Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Số khách hàng theo Broker
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBrokersByCustomers} layout="vertical">
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
                    formatter={(value: any, name: any) => {
                      if (name === 'Còn lại (KH)') return '';
                      return `${value} khách`;
                    }}
                    labelFormatter={(label: any) => {
                      const broker = topBrokersByCustomers.find((b: any) => b.name === label);
                      return broker ? `${broker.name} - ${broker.completion}%` : label;
                    }}
                  />
                  <Bar dataKey="khachHang" name="Khách hàng thực tế" stackId="customers" fill="#f59e0b" />
                  <Bar dataKey="gap" name="Còn lại (KH)" stackId="customers" fill="#d1d5db" />
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
                    formatter={(value: any, name: any) => {
                      if (name === 'Còn lại (KH)') return '';
                      return typeof value === 'number' ? `${(value / 1000000000).toFixed(2)} tỷ đ` : '';
                    }}
                    labelFormatter={(label: any) => {
                      const broker = topBrokersByMarginDebt.find((b: any) => b.name === label);
                      return broker ? `${broker.name} - ${broker.completion}%` : label;
                    }}
                  />
                  <Bar dataKey="duNoMargin" name="Dư nợ thực tế" stackId="margin" fill="#ef4444" />
                  <Bar dataKey="gap" name="Còn lại (KH)" stackId="margin" fill="#d1d5db" />
                </BarChart>
              </ResponsiveContainer>
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
