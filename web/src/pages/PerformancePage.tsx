import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { mockPerformanceReports } from '../data/mockData';
import { DataTable } from '../components/shared/DataTable';

export function PerformancePage() {

  // Aggregate data by period
  const performanceByPeriod = mockPerformanceReports.reduce((acc: any, report) => {
    const existing = acc.find((p: any) => p.period === report.period);
    if (existing) {
      existing.totalCommission += report.totalCommission;
      existing.totalOrders += report.totalOrders;
      existing.newAccounts += report.newAccountsOpened;
      existing.brokerCount += 1;
    } else {
      acc.push({
        period: report.period,
        totalCommission: report.totalCommission,
        totalOrders: report.totalOrders,
        newAccounts: report.newAccountsOpened,
        brokerCount: 1,
      });
    }
    return acc;
  }, []);

  // Top brokers by commission
  const topBrokers = [...mockPerformanceReports]
    .sort((a, b) => b.totalCommission - a.totalCommission)
    .slice(0, 10);

  // Scatter data - Commission vs Orders
  const scatterData = mockPerformanceReports.map(report => ({
    x: report.totalOrders,
    y: report.totalCommission / 1000000000,
    brokerName: report.brokerName,
  }));

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
    },
    {
      key: 'tradingFrequency',
      label: 'Tần suất giao dịch',
      render: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Phân tích hiệu suất</h1>
          <p className="text-accent-100 text-lg">Theo dõi và phân tích hiệu suất bán hàng chi tiết</p>
        </div>
      </div>

      {/* Period Performance */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hiệu suất theo kỳ
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceByPeriod.slice(0, 6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" stroke="#9ca3af" />
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
              dataKey="totalCommission"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Hoa hồng"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="totalOrders"
              stroke="#10b981"
              strokeWidth={2}
              name="Số lệnh"
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Commission vs Orders Scatter */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mối quan hệ: Số lệnh vs Hoa hồng
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="x" name="Số lệnh" stroke="#9ca3af" />
            <YAxis dataKey="y" name="Hoa hồng (tỷ đ)" stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter name="Broker" data={scatterData} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Top Brokers */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 10 Broker theo hoa hồng
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topBrokers}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="brokerName" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: any) => (value / 1000000000).toFixed(2)}
            />
            <Bar dataKey="totalCommission" fill="#3b82f6" name="Hoa hồng (tỷ đ)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Table */}
      <DataTable
        title="Chi tiết hiệu suất từng broker"
        columns={columns}
        data={mockPerformanceReports}
        searchFields={['brokerName']}
        onExport={() => alert('Export feature coming soon')}
      />
    </div>
  );
}
