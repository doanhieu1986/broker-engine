import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '../shared/DataTable';
import { mockPerformanceReports, mockSupportCases, mockMarketNews, mockStaffPotential, mockCooperatorPotential, mockBirthdayReport, mockMarginReport } from '../../data/mockData';

export function ReportsTabContent() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam || 'performance';
  });
  const [marginBrokerFilter, setMarginBrokerFilter] = useState('');
  const [marginStatusFilter, setMarginStatusFilter] = useState('');
  const [birthdayBrokerFilter, setBirthdayBrokerFilter] = useState('');
  const [birthdayClassificationFilter, setBirthdayClassificationFilter] = useState('');
  const [supportTypeFilter, setSupportTypeFilter] = useState('');
  const [supportStatusFilter, setSupportStatusFilter] = useState('');
  const [supportSentimentFilter, setSupportSentimentFilter] = useState('');
  const [supportBrokerFilter, setSupportBrokerFilter] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const performanceColumns = [
    {
      key: 'brokerName',
      label: 'Tên broker',
      sortable: true,
    },
    {
      key: 'period',
      label: 'Kỳ',
    },
    {
      key: 'newAccountsOpened',
      label: 'Tài khoản mở mới',
      sortable: true,
    },
    {
      key: 'totalCommission',
      label: 'Hoa hồng (tỷ đ)',
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
    },
    {
      key: 'totalTradingValue',
      label: 'Giá trị giao dịch (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
  ];

  const supportColumns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'customerId',
      label: 'Mã KH',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Tên KH',
      sortable: true,
    },
    {
      key: 'brokerName',
      label: 'Môi giới quản lý',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Loại',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          value === 'Mở' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'sentiment',
      label: 'Cảm xúc',
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
      sortable: true,
    },
  ];

  const newsColumns = [
    {
      key: 'title',
      label: 'Tiêu đề',
      sortable: true,
    },
    {
      key: 'source',
      label: 'Nguồn',
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {value}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (value: string) => (
        <span className="px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {value}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Ngày',
      sortable: true,
    },
  ];

  const staffPotentialColumns = [
    {
      key: 'staffName',
      label: 'Tên nhân viên',
      sortable: true,
    },
    {
      key: 'currentLevel',
      label: 'Chức vụ hiện tại',
    },
    {
      key: 'achievement',
      label: 'Thành tích (%)',
      sortable: true,
    },
    {
      key: 'daysInCompany',
      label: 'Ngày làm việc',
      sortable: true,
    },
    {
      key: 'commission',
      label: 'Hoa hồng (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
      sortable: true,
    },
    {
      key: 'recommendation',
      label: 'Đề xuất',
    },
  ];

  const cooperatorPotentialColumns = [
    {
      key: 'staffName',
      label: 'Tên khách hàng',
      sortable: true,
    },
    {
      key: 'currentLevel',
      label: 'Phân loại',
    },
    {
      key: 'achievement',
      label: 'Thành tích (%)',
      sortable: true,
    },
    {
      key: 'daysInCompany',
      label: 'Ngày hoạt động',
      sortable: true,
    },
    {
      key: 'commission',
      label: 'Hoa hồng (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
      sortable: true,
    },
    {
      key: 'recommendation',
      label: 'Đề xuất',
    },
  ];

  const birthdayReportColumns = [
    {
      key: 'stt',
      label: 'STT',
      width: 'w-12',
    },
    {
      key: 'customerId',
      label: 'Mã KH',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Tên Khách Hàng',
      sortable: true,
    },
    {
      key: 'dob',
      label: 'Ngày Sinh',
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      key: 'daysUntilBirthday',
      label: 'Còn Lại',
      sortable: true,
      render: (value: number) => `${value} ngày`,
    },
    {
      key: 'classification',
      label: 'Phân Loại',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'VIP' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          value === 'Mass' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          value === 'Newbie' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'brokerName',
      label: 'Môi Giới Quản Lý',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'SĐT Liên Hệ',
    },
    {
      key: 'email',
      label: 'Email',
    },
  ];

  const marginReportColumns = [
    // Group A: Customer & Manager Info
    {
      key: 'customerName',
      label: 'Tên khách hàng',
      sortable: true,
    },
    {
      key: 'accountNumber',
      label: 'Số tài khoản',
    },
    {
      key: 'brokerName',
      label: 'Môi giới quản lý',
    },
    // Group B: Margin Ratios Status
    {
      key: 'currentMarginRatio',
      label: 'Tỷ lệ ký quỹ hiện tại (%)',
      sortable: true,
    },
    {
      key: 'maintenanceRatio',
      label: 'Tỷ lệ duy trì (%)',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: string) => {
        const statusColors: {[key: string]: string} = {
          'Warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          'Call Margin': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
          'Force Sell': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          'Monitoring': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[value] || statusColors['Monitoring']}`}>
            {value}
          </span>
        );
      },
    },
    // Group C: Financial Metrics
    {
      key: 'totalAssetValue',
      label: 'Tổng tài sản (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
      sortable: true,
    },
    {
      key: 'totalDebt',
      label: 'Tổng dư nợ (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
    {
      key: 'equity',
      label: 'Tài sản ròng (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
    {
      key: 'callAmount',
      label: 'Số tiền cần nộp (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
      sortable: true,
    },
    {
      key: 'sellAmountToCover',
      label: 'Giá trị cần bán (tỷ đ)',
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
    // Group D: Timeline
    {
      key: 'callDate',
      label: 'Ngày phát sinh Call',
    },
    {
      key: 'dueDate',
      label: 'Hạn chót nộp tiền',
      sortable: true,
    },
    {
      key: 'expectedForceSellDate',
      label: 'Ngày dự kiến Force Sell',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs - Segment Control Style */}
      <div className="inline-flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex-wrap">
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'performance'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Hiệu suất bán hàng
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'support'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Hỗ trợ khách hàng
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'news'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Tin tức thị trường
        </button>
        <button
          onClick={() => setActiveTab('staffPotential')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'staffPotential'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Nhân viên tiềm năng
        </button>
        <button
          onClick={() => setActiveTab('cooperatorPotential')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'cooperatorPotential'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Cộng tác viên tiềm năng
        </button>
        <button
          onClick={() => setActiveTab('birthday')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'birthday'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Sinh nhật khách hàng
        </button>
        <button
          onClick={() => setActiveTab('margin')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'margin'
              ? 'bg-white dark:bg-slate-900 text-accent-600 dark:text-accent-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          Khách hàng đến hạn margin
        </button>
      </div>

      {/* Content */}
      {activeTab === 'performance' && (
        <DataTable
          title="Báo cáo hiệu suất bán hàng"
          columns={performanceColumns}
          data={mockPerformanceReports}
          searchFields={['brokerName']}
          onExport={() => alert('Export feature coming soon')}
          compact
        />
      )}

      {activeTab === 'support' && (
        <div>
          {/* Support stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng case</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockSupportCases.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Case mở</p>
              <p className="text-2xl font-bold text-red-600">{mockSupportCases.filter(c => c.status === 'Mở').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{mockSupportCases.filter(c => c.status === 'Đang xử lý').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Đã giải quyết</p>
              <p className="text-2xl font-bold text-green-600">{mockSupportCases.filter(c => c.status === 'Đã giải quyết').length}</p>
            </div>
          </div>

          <DataTable
            title="Danh sách các case"
            columns={supportColumns}
            data={mockSupportCases.filter((item) => {
              const typeMatch = !supportTypeFilter || item.type === supportTypeFilter;
              const statusMatch = !supportStatusFilter || item.status === supportStatusFilter;
              const sentimentMatch = !supportSentimentFilter || item.sentiment === supportSentimentFilter;
              const brokerMatch = !supportBrokerFilter || item.brokerName === supportBrokerFilter;
              return typeMatch && statusMatch && sentimentMatch && brokerMatch;
            })}
            searchFields={['id', 'type']}
            onExport={() => alert('Export feature coming soon')}
            compact
            filters={
              <>
                <select
                  value={supportTypeFilter}
                  onChange={(e) => setSupportTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Tất cả loại</option>
                  {Array.from(new Set(mockSupportCases.map(c => c.type))).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={supportStatusFilter}
                  onChange={(e) => setSupportStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  {Array.from(new Set(mockSupportCases.map(c => c.status))).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  value={supportSentimentFilter}
                  onChange={(e) => setSupportSentimentFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Tất cả cảm xúc</option>
                  {Array.from(new Set(mockSupportCases.map(c => c.sentiment))).map((sentiment) => (
                    <option key={sentiment} value={sentiment}>
                      {sentiment}
                    </option>
                  ))}
                </select>
                <select
                  value={supportBrokerFilter}
                  onChange={(e) => setSupportBrokerFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Tất cả môi giới</option>
                  {Array.from(new Set(mockSupportCases.map(c => c.brokerName))).map((broker) => (
                    <option key={broker} value={broker}>
                      {broker}
                    </option>
                  ))}
                </select>
              </>
            }
          />
        </div>
      )}

      {activeTab === 'news' && (
        <DataTable
          title="Tin tức thị trường"
          columns={newsColumns}
          data={mockMarketNews}
          searchFields={['title', 'content']}
          onExport={() => alert('Export feature coming soon')}
          compact
        />
      )}

      {activeTab === 'staffPotential' && (
        <DataTable
          title="Danh sách nhân viên tiềm năng"
          columns={staffPotentialColumns}
          data={mockStaffPotential}
          searchFields={['staffName', 'recommendation']}
          onExport={() => alert('Export feature coming soon')}
          compact
        />
      )}

      {activeTab === 'cooperatorPotential' && (
        <DataTable
          title="Danh sách cộng tác viên tiềm năng"
          columns={cooperatorPotentialColumns}
          data={mockCooperatorPotential}
          searchFields={['staffName', 'recommendation']}
          onExport={() => alert('Export feature coming soon')}
          compact
        />
      )}

      {activeTab === 'birthday' && (
        <DataTable
          title="Danh sách khách hàng sinh nhật"
          columns={birthdayReportColumns}
          data={mockBirthdayReport.filter((item) => {
            const brokerMatch = !birthdayBrokerFilter || item.brokerName === birthdayBrokerFilter;
            const classificationMatch = !birthdayClassificationFilter || item.classification === birthdayClassificationFilter;
            return brokerMatch && classificationMatch;
          }).map((item, index) => ({ ...item, stt: index + 1 }))}
          searchFields={['customerName', 'phone']}
          onExport={() => alert('Export feature coming soon')}
          compact
          filters={
            <>
              <select
                value={birthdayBrokerFilter}
                onChange={(e) => setBirthdayBrokerFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="">Tất cả môi giới</option>
                {Array.from(new Set(mockBirthdayReport.map(r => r.brokerName))).map((broker) => (
                  <option key={broker} value={broker}>
                    {broker}
                  </option>
                ))}
              </select>
              <select
                value={birthdayClassificationFilter}
                onChange={(e) => setBirthdayClassificationFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="">Tất cả phân loại</option>
                {Array.from(new Set(mockBirthdayReport.map(r => r.classification))).map((classification) => (
                  <option key={classification} value={classification}>
                    {classification}
                  </option>
                ))}
              </select>
            </>
          }
        />
      )}

      {activeTab === 'margin' && (
        <DataTable
          title="Danh sách khách hàng đến hạn Margin"
          columns={marginReportColumns}
          data={mockMarginReport.filter((item) => {
            const brokerMatch = !marginBrokerFilter || item.brokerName === marginBrokerFilter;
            const statusMatch = !marginStatusFilter || item.status === marginStatusFilter;
            return brokerMatch && statusMatch;
          })}
          searchFields={['customerName', 'accountNumber']}
          onExport={() => alert('Export feature coming soon')}
          compact
          filters={
            <>
              <select
                value={marginBrokerFilter}
                onChange={(e) => setMarginBrokerFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="">Tất cả môi giới</option>
                {Array.from(new Set(mockMarginReport.map(r => r.brokerName))).map((broker) => (
                  <option key={broker} value={broker}>
                    {broker}
                  </option>
                ))}
              </select>
              <select
                value={marginStatusFilter}
                onChange={(e) => setMarginStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="">Tất cả trạng thái</option>
                {Array.from(new Set(mockMarginReport.map(r => r.status))).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </>
          }
        />
      )}
    </div>
  );
}
