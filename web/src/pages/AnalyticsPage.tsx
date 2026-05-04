import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCustomers } from '../data/mockData';
import { StatCard } from '../components/shared/StatCard';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  const [period, setPeriod] = useState('month');

  // Calculate analytics
  const vipCustomers = mockCustomers.filter(c => c.classification === 'VIP');
  const massCustomers = mockCustomers.filter(c => c.classification === 'Mass');

  const avgNav = mockCustomers.reduce((sum, c) => sum + c.nav, 0) / mockCustomers.length;
  const avgProfit = mockCustomers.reduce((sum, c) => sum + c.profit, 0) / mockCustomers.length;

  // Daily/Weekly/Monthly data
  const weeklyData = [
    { week: 'Tuần 1', orders: 450, commission: 2400, customers: 120 },
    { week: 'Tuần 2', orders: 620, commission: 3200, customers: 145 },
    { week: 'Tuần 3', orders: 580, commission: 2800, customers: 135 },
    { week: 'Tuần 4', orders: 890, commission: 3800, customers: 165 },
  ];

  const monthlyData = [
    { month: 'T1', revenue: 4000, customers: 240, churn: 2.1 },
    { month: 'T2', revenue: 3000, customers: 221, churn: 2.2 },
    { month: 'T3', revenue: 2000, customers: 229, churn: 2.1 },
    { month: 'T4', revenue: 2780, customers: 200, churn: 2.5 },
    { month: 'T5', revenue: 1890, customers: 218, churn: 2.1 },
    { month: 'T6', revenue: 2390, customers: 250, churn: 2.2 },
  ];

  // Customer distribution by NAV
  const navDistribution = [
    { range: 'Dưới 100M', count: mockCustomers.filter(c => c.nav < 100000000).length },
    { range: '100M - 500M', count: mockCustomers.filter(c => c.nav >= 100000000 && c.nav < 500000000).length },
    { range: '500M - 1B', count: mockCustomers.filter(c => c.nav >= 500000000 && c.nav < 1000000000).length },
    { range: 'Trên 1B', count: mockCustomers.filter(c => c.nav >= 1000000000).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Phân tích dữ liệu</h1>
          <p className="text-accent-100 text-lg">Khám phá các xu hướng, mô hình và thống kê chi tiết về khách hàng</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Khách hàng VIP"
          value={vipCustomers.length}
          unit="khách hàng"
          icon={<Users className="text-purple-600" size={24} />}
          trend={5}
        />
        <StatCard
          title="Khách hàng Mass"
          value={massCustomers.length}
          unit="khách hàng"
          icon={<Users className="text-blue-600" size={24} />}
          trend={8}
        />
        <StatCard
          title="NAV trung bình"
          value={(avgNav / 1000000000).toFixed(2)}
          unit="tỷ đ"
          icon={<TrendingUp className="text-green-600" size={24} />}
          trend={3}
        />
        <StatCard
          title="Lợi nhuận trung bình"
          value={(avgProfit / 1000000).toFixed(2)}
          unit="triệu đ"
          icon={<BarChart3 className="text-orange-600" size={24} />}
          trend={-2}
        />
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
          }`}
        >
          Theo tuần
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
          }`}
        >
          Theo tháng
        </button>
      </div>

      {/* Performance Trend */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Xu hướng hiệu suất
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={(period === 'week' ? weeklyData : monthlyData) as any}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={period === 'week' ? 'week' : 'month'} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Doanh thu"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customers Growth */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phát triển khách hàng
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#10b981"
                strokeWidth={2}
                name="Số khách hàng"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NAV Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phân bố NAV khách hàng
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={navDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" name="Số khách hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Churn Rate */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tỷ lệ khách hàng không hoạt động (Churn Rate)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="churn"
              stroke="#ef4444"
              strokeWidth={2}
              name="Churn Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
