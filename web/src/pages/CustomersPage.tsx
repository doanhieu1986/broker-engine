import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from '../components/shared/DataTable';
import { mockCustomers } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function CustomersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useUser();
  const [pageTab, setPageTab] = useState('overview');
  const [selectedActionTitle, setSelectedActionTitle] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetailTab, setCustomerDetailTab] = useState('customerInfo');
  const [selectedSubaccount, setSelectedSubaccount] = useState(1);
  const [subaccountDetailTab, setSubaccountDetailTab] = useState('info');

  // Handle navigation from BrokerDetailPage
  useEffect(() => {
    if (location.state?.selectedCustomer) {
      setSelectedCustomer(location.state.selectedCustomer);
    }
  }, [location.state?.selectedCustomer]);

  // Filter customers based on role
  let filteredCustomers = mockCustomers;

  // Filter by role: Manager sees own customers + managed brokers' customers, Broker sees own customers
  if (role === 'Manager' && user.managedBrokerCodes) {
    const brokerMap: Record<string, string> = {
      'BRK000': 'Nguyễn Quản Lý',
      'BRK001': 'Nguyễn Minh Tuấn',
      'BRK002': 'Trần Thị Hoa',
      'BRK003': 'Phạm Văn Đức',
      'BRK004': 'Lê Quang Minh',
      'BRK005': 'Võ Thị Mai',
      'BRK006': 'Hoàng Văn Long',
      'BRK007': 'Đặng Thị Linh',
      'BRK008': 'Bùi Minh Khoa',
      'BRK009': 'Hồ Thị Thanh',
      'BRK010': 'Dương Văn Hải',
    };
    // Include own customers (BRK000) + managed brokers' customers
    const allowedBrokerCodes = ['BRK000', ...user.managedBrokerCodes];
    filteredCustomers = filteredCustomers.filter(c =>
      allowedBrokerCodes.some(code => c.brokerName === brokerMap[code])
    );
  } else if (role === 'Broker') {
    filteredCustomers = filteredCustomers.filter(c => c.brokerName === user.name);
  }

  // Apply user filters
  if (selectedRegion) {
    filteredCustomers = filteredCustomers.filter(c => c.region === selectedRegion);
  }
  if (selectedClassification) {
    filteredCustomers = filteredCustomers.filter(c => c.classification === selectedClassification);
  }
  if (selectedStatus) {
    filteredCustomers = filteredCustomers.filter(c =>
      selectedStatus === 'true' ? c.activeStatus : !c.activeStatus
    );
  }
  if (selectedBroker) {
    filteredCustomers = filteredCustomers.filter(c => c.brokerName === selectedBroker);
  }

  const regions = Array.from(new Set(mockCustomers.map(c => c.region)));
  const classifications = Array.from(new Set(mockCustomers.map(c => c.classification)));

  // Overview tab data
  const classificationData = [
    { name: 'VIP', value: filteredCustomers.filter(c => c.classification === 'VIP').length },
    { name: 'Mass', value: filteredCustomers.filter(c => c.classification === 'Mass').length },
    { name: 'Newbie', value: filteredCustomers.filter(c => c.classification === 'Newbie').length },
    { name: 'Dormant', value: filteredCustomers.filter(c => c.classification === 'Dormant').length },
  ];

  const statusData = [
    { name: 'Prospect', value: filteredCustomers.filter(c => c.classification === 'Newbie' && !c.activeStatus).length },
    { name: 'Active', value: filteredCustomers.filter(c => c.activeStatus && c.classification !== 'Dormant').length },
    { name: 'Inactive', value: filteredCustomers.filter(c => !c.activeStatus && c.classification !== 'Newbie' && c.classification !== 'Dormant').length },
    { name: 'Dormant', value: filteredCustomers.filter(c => c.classification === 'Dormant').length },
    { name: 'Churn', value: Math.max(1, Math.round(filteredCustomers.length * 0.05)) },
  ];

  const brokerMap: Record<string, number> = {};
  filteredCustomers.forEach(c => {
    brokerMap[c.brokerName] = (brokerMap[c.brokerName] || 0) + 1;
  });
  const brokerDistData = Object.entries(brokerMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const CLASSIFICATION_COLORS = ['#7c3aed', '#9ca3af', '#22c55e', '#f59e0b'];
  const STATUS_COLORS: Record<string, string> = {
    'Prospect': '#3b82f6',
    'Active': '#22c55e',
    'Inactive': '#9ca3af',
    'Dormant': '#f59e0b',
    'Churn': '#ef4444',
  };

  const columns = [
    {
      key: 'name',
      label: 'Tên khách hàng',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Điện thoại',
    },
    {
      key: 'classification',
      label: 'Phân loại',
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
      label: 'Môi giới quản lý',
      sortable: true,
      render: (value: string, row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/brokers/${row.brokerCode}`);
          }}
          className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold hover:underline"
        >
          {row.brokerCode} - {value}
        </button>
      ),
    },
    {
      key: 'nav',
      label: 'NAV (tỷ đ)',
      sortable: true,
      render: (value: number) => (value / 1000000000).toFixed(2),
    },
    {
      key: 'region',
      label: 'Khu vực',
    },
    {
      key: 'activeStatus',
      label: 'Trạng thái',
      render: (value: boolean) => (
        <span className={value ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
          {value ? '✓ Hoạt động' : '✗ Không hoạt động'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Quản lý khách hàng</h1>
          <p className="text-accent-100 text-lg">Danh sách toàn bộ khách hàng và thông tin chi tiết</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-950 rounded-lg shadow">
        <div className="flex gap-6 px-6 py-0 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setPageTab('overview')}
            className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
              pageTab === 'overview'
                ? 'border-accent-500 text-accent-500'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Tổng quan nền khách hàng
          </button>
          <button
            onClick={() => setPageTab('list')}
            className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
              pageTab === 'list'
                ? 'border-accent-500 text-accent-500'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Danh sách khách hàng
          </button>
          <button
            onClick={() => setPageTab('todo')}
            className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
              pageTab === 'todo'
                ? 'border-accent-500 text-accent-500'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            To-do list
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {pageTab === 'overview' && (
        <div className="space-y-6">
          {/* Row 1: Classification + Status Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classification Pie Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cơ cấu phân loại khách hàng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    {classificationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CLASSIFICATION_COLORS[index % CLASSIFICATION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value} khách hàng`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Bar Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Phân bố trạng thái khách hàng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937'
                    }}
                    formatter={(value: any) => `${value} khách hàng`}
                  />
                  <Bar dataKey="value" name="Số khách hàng">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Broker Distribution Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Phân bố khách hàng theo Broker
            </h3>
            <ResponsiveContainer width="100%" height={brokerDistData.length * 50 + 50}>
              <BarChart data={brokerDistData} layout="vertical">
                <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" strokeWidth={1.5} />
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#1f2937'
                  }}
                  formatter={(value: any) => `${value} khách hàng`}
                />
                <Bar dataKey="value" name="Số khách hàng">
                  {brokerDistData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={i === 0 ? '#7c3aed' : '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customer List Tab */}
      {pageTab === 'list' && (
        <>
          <DataTable
        title={`Danh sách khách hàng (${filteredCustomers.length})`}
        columns={columns}
        data={filteredCustomers}
        searchFields={['name', 'email', 'phone']}
        onExport={() => alert('Export feature coming soon')}
        onRowClick={(customer) => setSelectedCustomer(customer)}
        filters={
          <div className="flex gap-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tất cả khu vực</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tất cả phân loại</option>
              {classifications.map(classification => (
                <option key={classification} value={classification}>{classification}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tất cả môi giới</option>
              {Array.from(new Set(mockCustomers.map(c => c.brokerName))).map(broker => (
                <option key={broker} value={broker}>{broker}</option>
              ))}
            </select>
          </div>
        }
      />
        </>
      )}

      {/* Customer Detail Full Screen */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start overflow-y-auto">
          <div className={`w-full mx-auto bg-white dark:bg-slate-950 ${customerDetailTab === 'subaccount' ? 'max-w-full lg:w-11/12' : 'max-w-6xl'}`}>
            {/* Header */}
            <div className="sticky top-0 z-40">
              {/* Customer Name Box */}
              <div className="bg-gradient-to-r from-accent-600 to-accent-800 text-white">
                <div className="px-6 py-3 border-b border-accent-700">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                      <p className="text-accent-100 text-xs mt-0.5">{selectedCustomer.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-white hover:text-accent-100 transition-colors text-3xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              {/* Tabs Bar */}
              <div className="bg-slate-950">
                {/* Tabs */}
                <div className="flex gap-6 px-6 py-0">
                <button
                  onClick={() => setCustomerDetailTab('customerInfo')}
                  className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
                    customerDetailTab === 'customerInfo'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Thông tin khách hàng
                </button>
                <button
                  onClick={() => setCustomerDetailTab('subaccount')}
                  className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
                    customerDetailTab === 'subaccount'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Thông tin chi tiết tiểu khoản
                </button>
                <button
                  onClick={() => setCustomerDetailTab('personalInfo')}
                  className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
                    customerDetailTab === 'personalInfo'
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Thông tin cá nhân
                </button>
              </div>
            </div>
            </div>

            <div className="p-4 space-y-4">
            {/* Customer Info Tab */}
            {customerDetailTab === 'customerInfo' && (
              <>
            {/* Quick Stats */}
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase">NAV</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCustomer.nav >= 1000000000
                    ? `${(selectedCustomer.nav / 1000000000).toFixed(1)}B`
                    : `${(selectedCustomer.nav / 1000000).toFixed(0)}M`
                  }
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">AUM</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCustomer.aum >= 1000000000
                    ? `${(selectedCustomer.aum / 1000000000).toFixed(1)}B`
                    : `${(selectedCustomer.aum / 1000000).toFixed(0)}M`
                  }
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Lợi nhuận</p>
                <p className={`text-xl font-bold ${selectedCustomer.profit >= 0 ? 'text-success-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                  {selectedCustomer.profit >= 0 ? '+' : ''}{(selectedCustomer.profit / 1000000).toFixed(0)}M
                  <span className={`text-sm font-normal ml-1 ${selectedCustomer.nav > 0 && (selectedCustomer.profit / selectedCustomer.nav) * 100 >= 0 ? 'text-success-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                    ({selectedCustomer.nav > 0
                      ? ((selectedCustomer.profit / selectedCustomer.nav) * 100).toFixed(1)
                      : '0'
                    }%)
                  </span>
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase">Số lệnh</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedCustomer.totalTrades}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Trạng thái</p>
                <p className={`text-base font-bold ${selectedCustomer.activeStatus ? 'text-success-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}>
                  {selectedCustomer.activeStatus ? '✓ Hoạt động' : '✗ Tạm ngừng'}
                </p>
              </div>
            </div>

            {/* Account Details */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">💳 Thông tin khách hàng</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Mã khách hàng</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.accountNumber.slice(0, -1)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ngày mở tài khoản</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.accountOpenDate}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Phân loại khách hàng</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.classification}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Mã Broker quản lý</p>
                  <button
                    onClick={() => navigate(`/brokers/${selectedCustomer.brokerCode}`)}
                    className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold hover:underline"
                  >
                    {selectedCustomer.brokerCode}
                  </button>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tỷ lệ nhận hoa hồng</p>
                  <p className="font-medium text-slate-900 dark:text-white">{(selectedCustomer.commissionRate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Phân nhóm Nav group</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.navGroup}</p>
                </div>
              </div>
            </div>

            {/* Next Best Actions */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">🎯 Hành động tiếp theo</h3>
              <div className="space-y-2">
                {selectedCustomer.nextBestActions && selectedCustomer.nextBestActions.length > 0 ? (
                  selectedCustomer.nextBestActions.map((action: any) => (
                    <div
                      key={action.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        action.priority === 'high'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : action.priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">{action.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{action.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{action.description}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                            action.priority === 'high'
                              ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100'
                              : action.priority === 'medium'
                              ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                              : 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                          }`}
                        >
                          {action.priority === 'high' ? 'Cao' : action.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Không có hành động được đề xuất</p>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">💰 Thông tin tài chính</h3>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tổng giá trị đầu tư</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedCustomer.investedValue >= 1000000000
                      ? `${(selectedCustomer.investedValue / 1000000000).toFixed(1)}B`
                      : `${(selectedCustomer.investedValue / 1000000).toFixed(0)}M`
                    }
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Có thể đầu tư</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {(selectedCustomer.aum - selectedCustomer.investedValue) >= 1000000000
                      ? `${((selectedCustomer.aum - selectedCustomer.investedValue) / 1000000000).toFixed(1)}B`
                      : `${((selectedCustomer.aum - selectedCustomer.investedValue) / 1000000).toFixed(0)}M`
                    }
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-4">
                {/* Industry Sectors Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Nhóm ngành đang đầu tư</h4>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={selectedCustomer.industrySectors}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {selectedCustomer.industrySectors.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#7c3aed', '#9ca3af', '#cbd5e1', '#e5e7eb'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Stock Types Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Nhóm cổ phiếu đang nắm giữ</h4>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={selectedCustomer.stockTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {selectedCustomer.stockTypes.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#7c3aed', '#9ca3af', '#cbd5e1'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Policy and Fee Schedule */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📋 Chính sách, biểu phí đang áp dụng</h3>
              <div className="space-y-3">
                {/* Fee Schedules */}
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Biểu phí:</p>
                  <div className="flex flex-wrap gap-2">
                    {['V13 - Gói phí 0.15%', 'V12 - Gói phí 0.20%', 'V11 - Gói phí 0.25%', 'V10 - Gói phí 0.30%'].map((fee) => (
                      <div
                        key={fee}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          selectedCustomer.policyFee.feeSchedule === fee
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {fee}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Chính sách:</p>
                  <div className="flex flex-wrap gap-2">
                    {['V+ đặc biệt', 'Lãi suất VIP', 'K+', 'Ưu đãi margin'].map((policy) => (
                      <div
                        key={policy}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          selectedCustomer.policyFee.policies.includes(policy)
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {policy}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Services */}
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Dịch vụ:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Lãi vay siêu hời', 'Đầu tư bứt phá', 'Ưu đãi lãi suất margin T5', 'Giao dịch tài chính - Lãi suất 13.5%'].map((service) => (
                      <div
                        key={service}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          selectedCustomer.policyFee.financialServices.includes(service)
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Using */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">🛍️ Sản phẩm</h3>
              <div className="flex flex-wrap gap-2">
                {['Chứng khoán', 'Trái phiếu', 'Quỹ mở', 'Phái sinh', 'Huy động vốn'].map((product) => (
                  <div
                    key={product}
                    className={`px-3 py-1 rounded-full font-semibold text-xs ${
                      selectedCustomer.preferredProducts.includes(product)
                        ? 'bg-accent-600 dark:bg-accent-700 text-white'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {product}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Profile & Preferences */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">💡 Khẩu vị & Sở thích</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Khẩu vị rủi ro:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Cao', 'Thấp', 'Cân bằng'].map((appetite) => (
                      <div
                        key={appetite}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          appetite === selectedCustomer.riskAppetite
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {appetite}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Sản phẩm ưu tiên:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Chứng khoán', 'Trái phiếu', 'Quỹ mở', 'Phái sinh', 'Huy động vốn'].map((product) => (
                      <div
                        key={product}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          selectedCustomer.preferredProducts.includes(product)
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {product}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Ngành nghề quan tâm:</p>
                  <div className="flex flex-wrap gap-2">
                    {['TMĐT', 'Bất động sản', 'Công nghệ', 'Ngân hàng', 'Năng lượng'].map((industry) => (
                      <div
                        key={industry}
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${
                          selectedCustomer.interestedIndustries.includes(industry)
                            ? 'bg-accent-600 dark:bg-accent-700 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {industry}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio - Stocks */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📈 Danh mục cổ phiếu đang nắm giữ</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[
                    { symbol: 'VNM', quantity: 5000 },
                    { symbol: 'HPG', quantity: 3200 },
                    { symbol: 'FPT', quantity: 2100 },
                    { symbol: 'ACB', quantity: 1500 },
                    { symbol: 'MBB', quantity: 800 },
                    { symbol: 'CTG', quantity: 2500 },
                  ].map((stock) => {
                    const change = (Math.random() * 8 - 4).toFixed(1);
                    const isPositive = parseFloat(change) >= 0;
                    return (
                      <div key={stock.symbol} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{stock.symbol}</p>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{stock.quantity.toLocaleString()} cp</p>
                        <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isPositive ? '+' : ''}{change}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact History */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📞 Lịch sử liên hệ gần đây</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-900 dark:text-white">Cuộc gọi tư vấn</span>
                  <span className="text-slate-500 dark:text-slate-400">28/04/2024</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-900 dark:text-white">Gửi khuyến nghị</span>
                  <span className="text-slate-500 dark:text-slate-400">26/04/2024</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <span className="text-slate-900 dark:text-white">Email giáo dục thị trường</span>
                  <span className="text-slate-500 dark:text-slate-400">25/04/2024</span>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Personal Info Tab */}
            {customerDetailTab === 'personalInfo' && (
              <>
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">👤 Thông tin cá nhân</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tên</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Điện thoại</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ngày sinh</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.dob}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Giới tính</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Khu vực</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.region}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Nghề nghiệp</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.occupation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Số CCCD</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.idCard}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ngày cấp CCCD</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.idCardIssuedDate}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Nơi cấp CCCD</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCustomer.idCardIssuedPlace}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Sở thích</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.hobbies.map((hobby: string, index: number) => (
                      <div key={index} className="bg-accent-600 dark:bg-accent-700 text-white px-3 py-1 rounded-full font-semibold text-xs">
                        {hobby}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Subaccount Tab */}
            {customerDetailTab === 'subaccount' && (
              <div className="space-y-4">
                {/* Sub-account tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                    {[1, 3, 6, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setSelectedSubaccount(num);
                          setSubaccountDetailTab('info');
                        }}
                        className={`px-4 py-2 font-semibold whitespace-nowrap rounded-lg transition-colors ${
                          selectedSubaccount === num
                            ? 'bg-accent-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Tiểu khoản {num}
                      </button>
                    ))}
                  </div>

                  {/* Inner tabs for Thông tin and Lịch sử giao dịch */}
                  <div className="flex gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                      onClick={() => setSubaccountDetailTab('info')}
                      className={`px-4 py-2 font-semibold whitespace-nowrap rounded-lg transition-colors text-sm ${
                        subaccountDetailTab === 'info'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Thông tin chi tiết tiểu khoản
                    </button>
                    <button
                      onClick={() => setSubaccountDetailTab('history')}
                      className={`px-4 py-2 font-semibold whitespace-nowrap rounded-lg transition-colors text-sm ${
                        subaccountDetailTab === 'history'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Lịch sử giao dịch
                    </button>
                  </div>

                  {/* Subaccount Details */}
                  <div className="p-3">
                    {subaccountDetailTab === 'info' && (
                      <div className="space-y-6">
                        {selectedSubaccount !== 8 && (
                    <>
                    {/* Table 1: Asset Information - Different for Subaccount 3 */}
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📊 Bảng 1: Thông tin chi tiết tài sản</h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                        <table className="w-full text-xs border-collapse">
                          {selectedSubaccount === 3 || selectedSubaccount === 6 ? (
                            <>
                              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                <tr>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiểu khoản</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Sản phẩm</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ lệ ký quỹ duy trì</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ lệ ký quỹ xử lý</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã rổ cho vay</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Dư nợ gốc</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiền mặt</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị tài sản ký quỹ</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Hạn mức cho vay còn lại TK3</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Hạn mức cho vay còn lại</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiền mặc có thể rút</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tổng tài sản</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã room</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài sản ròng</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị chứng khoán cho vay</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài sản ròng thực tế</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Sức mua tối thiểu</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Sức mua sau cấp Hạn mức trong ngày</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí phải trả</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.accountNumber.slice(0, -1)}{selectedSubaccount}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? 'SM3.24.08' : 'SM6.24.12'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '30%' : '32%'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '25%' : '27%'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? 'BASKET01' : 'BASKET02'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '2.500 tỷ' : '3.200 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '850 tỷ' : '950 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '3.200 tỷ' : '4.100 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '1.800 tỷ' : '2.200 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '2.000 tỷ' : '2.500 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '750 tỷ' : '850 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '4.050 tỷ' : '5.050 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? 'ASS' : 'BRK'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '3.850 tỷ' : '4.750 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '500 tỷ' : '600 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '3.350 tỷ' : '4.150 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '2.500 tỷ' : '3.100 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '1.950 tỷ' : '2.550 tỷ'}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedSubaccount === 3 ? '125 tỷ' : '150 tỷ'}</td>
                                </tr>
                              </tbody>
                            </>
                          ) : (
                            <>
                              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                <tr>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiểu khoản</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tên khách hàng</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài sản ròng</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Cổ tức tiền</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Sức mua</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền phong tỏa</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiền mặt có thể rút</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiền hạn mức có thể rút</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí phải trả</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Hạn mức trong ngày</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Hạn mức trong ngày đang sử dụng</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiền rút chờ duyệt</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Hạn mức tài khoản</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Gify nhận</th>
                                  <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Gify tặng</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.accountNumber.slice(0, -1)}{selectedSubaccount}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.name}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">1.594 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">1.425 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">1.557 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">1.557 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">1.557 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">5 tỷ</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">0</td>
                                </tr>
                              </tbody>
                            </>
                          )}
                        </table>
                      </div>
                    </div>

                    {/* Table 2: Securities Portfolio Status */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📈 Bảng 2: Trạng thái danh mục chứng khoán</h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                        <table className="w-full text-xs border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                            <tr>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tiểu khoản</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Chủ tài khoản</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã chứng khoán</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại chứng khoán</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị thị trường</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ trọng danh mục</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Lãi/Lỗ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {(selectedSubaccount === 3
                              ? [
                                  { symbol: 'FPT', type: '02', value: 450000000, marketValue: 495000000, ratio: 30, pnl: 45000000 },
                                  { symbol: 'GAS', type: '02', value: 320000000, marketValue: 288000000, ratio: 25, pnl: -32000000 },
                                  { symbol: 'CTG', type: '02', value: 380000000, marketValue: 418000000, ratio: 28, pnl: 38000000 },
                                  { symbol: 'VNM', type: '02', value: 200000000, marketValue: 220000000, ratio: 17, pnl: 20000000 },
                                ]
                              : selectedSubaccount === 6
                              ? [
                                  { symbol: 'VJC', type: '02', value: 550000000, marketValue: 605000000, ratio: 32, pnl: 55000000 },
                                  { symbol: 'BID', type: '02', value: 380000000, marketValue: 342000000, ratio: 28, pnl: -38000000 },
                                  { symbol: 'ACB', type: '02', value: 420000000, marketValue: 462000000, ratio: 40, pnl: 42000000 },
                                ]
                              : [
                                  { symbol: 'HAO', type: '02', value: 280000000, marketValue: 306000000, ratio: 25, pnl: 26000000 },
                                  { symbol: 'SHB', type: '02', value: 11204000, marketValue: 6700000, ratio: 35, pnl: -4504000 },
                                  { symbol: 'VCB', type: '02', value: 6472000, marketValue: 17700000, ratio: 40, pnl: 11228000 },
                                ]
                            ).map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.accountNumber.slice(0, -1)}{selectedSubaccount}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.name}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.symbol}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.type}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.value / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.marketValue / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.ratio}%</td>
                                <td className={`border border-slate-200 dark:border-slate-700 px-2 py-1 whitespace-nowrap font-semibold ${row.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {row.pnl >= 0 ? '+' : ''}{(row.pnl / 1000000).toFixed(0)}M
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    </>
                    )}

                    {selectedSubaccount === 8 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase">💼 Thông tin chi tiết tài sản</h3>

                      {/* Tiền mặt - Cash */}
                      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">💵 Tiền mặt</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền mặt</p><p className="text-slate-900 dark:text-white font-medium mt-1">2.500 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền chưa thanh toán</p><p className="text-slate-900 dark:text-white font-medium mt-1">150 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền mặt có thể rút</p><p className="text-slate-900 dark:text-white font-medium mt-1">2.300 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền chờ xử lý tại VSD</p><p className="text-slate-900 dark:text-white font-medium mt-1">75 tỷ</p></div>
                        </div>
                      </div>

                      {/* Phí & Thuế - Fees & Taxes */}
                      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">📊 Phí & Thuế</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí GD và thuế</p><p className="text-slate-900 dark:text-white font-medium mt-1">25 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí giao dịch</p><p className="text-slate-900 dark:text-white font-medium mt-1">12 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí giao dịch trả Sở</p><p className="text-slate-900 dark:text-white font-medium mt-1">8 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí xử lý giao dịch</p><p className="text-slate-900 dark:text-white font-medium mt-1">5 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Thuế</p><p className="text-slate-900 dark:text-white font-medium mt-1">10 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí quản lý tài sản ký quỹ</p><p className="text-slate-900 dark:text-white font-medium mt-1">3 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Phí quản lý vị thế VSD</p><p className="text-slate-900 dark:text-white font-medium mt-1">2 tỷ</p></div>
                        </div>
                      </div>

                      {/* Ký quỹ & Margin */}
                      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">🔐 Ký quỹ & Margin</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền ký quỹ</p><p className="text-slate-900 dark:text-white font-medium mt-1">1.200 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tiền ký quỹ có thể rút</p><p className="text-slate-900 dark:text-white font-medium mt-1">950 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Ký quỹ ban đầu (IM)</p><p className="text-slate-900 dark:text-white font-medium mt-1">1.000 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Ký quỹ chuyển giao</p><p className="text-slate-900 dark:text-white font-medium mt-1">1.100 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Ký quỹ yêu cầu (MR)</p><p className="text-slate-900 dark:text-white font-medium mt-1">1.050 tỷ</p></div>
                        </div>
                      </div>

                      {/* Chứng khoán - Securities */}
                      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">📈 Chứng khoán</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Giá trị chứng khoán</p><p className="text-slate-900 dark:text-white font-medium mt-1">4.500 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Giá trị Lãi/Lỗ (VM)</p><p className="text-slate-900 dark:text-white font-medium mt-1">+350 tỷ</p></div>
                        </div>
                      </div>

                      {/* Tài sản & Sức mua - Assets */}
                      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">💎 Tài sản & Sức mua</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tài sản hợp lệ</p><p className="text-slate-900 dark:text-white font-medium mt-1">6.800 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Số tiền cần bổ sung</p><p className="text-slate-900 dark:text-white font-medium mt-1">50 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Sức mua</p><p className="text-slate-900 dark:text-white font-medium mt-1">2.100 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tổng tài sản</p><p className="text-slate-900 dark:text-white font-medium mt-1">7.000 tỷ</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold font-bold text-sm">Tài sản ròng</p><p className="text-slate-900 dark:text-white font-bold mt-1">5.750 tỷ</p></div>
                        </div>
                      </div>

                      {/* Cấu hình Tài khoản - Account Config */}
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">⚙️ Cấu hình tài khoản</p>
                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Gói dịch vụ</p><p className="text-slate-900 dark:text-white font-medium mt-1">Gói H2</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Loại Tài khoản</p><p className="text-slate-900 dark:text-white font-medium mt-1">Netted</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tỷ lệ tài khoản VSD</p><p className="text-slate-900 dark:text-white font-medium mt-1">92%</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Tỷ lệ an toàn</p><p className="text-slate-900 dark:text-white font-medium mt-1">145%</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">% chốt lời cắt lỗ theo CG</p><p className="text-slate-900 dark:text-white font-medium mt-1">85%</p></div>
                          <div><p className="text-slate-600 dark:text-slate-400 font-semibold">Chuyên gia đầu tư</p><p className="text-slate-900 dark:text-white font-medium mt-1">{selectedCustomer.brokerCode}</p></div>
                        </div>
                      </div>

                      {/* Bảng Chi tiết giá trị ký quỹ */}
                      <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg p-4">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📋 Bảng chi tiết giá trị ký quỹ</h3>
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                          <table className="w-full text-xs border-collapse">
                            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                              <tr>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã Hợp đồng</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ lệ IM</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Biên độ</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Khối lượng ký quỹ</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Vị thế</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trung bình</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá thực tế</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">IM dự kiến</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">IM</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">VM</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">DM</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">MR</th>
                                <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {[
                                { type: 'LONG', contract: 'VN30F2502', imRate: '5%', margin: '0.5%', volume: 100, position: 50, avgPrice: 1250.5, actualPrice: 1255.3, imExpected: 525, im: 512.5, vm: 235, dm: 50, mr: 487.5, action: 'HOLD' },
                                { type: 'SHORT', contract: 'VN30F2503', imRate: '5%', margin: '0.5%', volume: 75, position: -30, avgPrice: 1248.2, actualPrice: 1252.8, imExpected: 393.75, im: 384.4, vm: -128, dm: 40, mr: 365.6, action: 'NET OFF' },
                                { type: 'LONG', contract: 'FVF2502', imRate: '10%', margin: '1%', volume: 50, position: 20, avgPrice: 18500, actualPrice: 18520, imExpected: 925, im: 925, vm: 400, dm: 30, mr: 877.5, action: 'ADD' },
                              ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs font-semibold">{row.type}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs font-medium">{row.contract}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.imRate}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.margin}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.volume}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.position}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.avgPrice}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.actualPrice}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.imExpected}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.im}</td>
                                  <td className={`border border-slate-200 dark:border-slate-700 px-1 py-3 whitespace-nowrap text-2xs font-medium ${row.vm >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{row.vm}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.dm}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.mr}</td>
                                  <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs font-semibold">{row.action}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    )}

                    {selectedSubaccount !== 3 && selectedSubaccount !== 6 && selectedSubaccount !== 8 && (
                    <>
                    {/* Table 3: INFY Contracts */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📋 Bảng 3: Hợp đồng INFY Tăng trưởng, Thịnh vượng</h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                        <table className="w-full text-xs border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                            <tr>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã Hợp đồng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tên khách hàng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Cán bộ quản lý</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Gói INFY</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Trạng thái hợp đồng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã chính sách</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đầu tư ban đầu</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đang đầu tư</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ suất lợi tức</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Lợi tức kỳ vọng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Thời điểm nhận cổ tức</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày bắt đầu</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày kết thúc</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Kỳ hạn</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị nhận được trước thuế</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Thuế TNCN</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị nhận được sau thuế</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài khoản nhận tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {[
                              { code: 'TV1312', manager: '1234 - Dõ Thanh Hà', package: 'BACK', status: 'Phát sinh mới', policy: '12T_CK_CD_INFY/03_CK_TV_INFY', initialAmount: 33000000, currentAmount: 33000000, rate: 6.5, expected: 2145000, dividend: 'Cuối kỳ', startDate: '25/11/2024', endDate: '25/11/2025', duration: '3 tháng', beforeTax: 33000000, tax: 0, afterTax: 33000000, account: 'Tiểu khoản 1' },
                              { code: 'TV1041', manager: '1234 - Dõ Thanh Hà', package: 'BACK', status: 'Chờ xử lý', policy: '12T_CK_CD_INFY/03_CK_TV_INFY', initialAmount: 30000000, currentAmount: 30000000, rate: 6.5, expected: 1950000, dividend: 'Hàng tháng', startDate: '01/12/2024', endDate: '01/12/2025', duration: '3 tháng', beforeTax: 30000000, tax: 0, afterTax: 30000000, account: 'Tiểu khoản 1' },
                              { code: 'TV1205', manager: '1234 - Dõ Thanh Hà', package: 'BACK', status: 'Chờ ngày bắt đầu', policy: '12T_CK_CD_INFY/03_CK_TV_INFY', initialAmount: 50000000, currentAmount: 50000000, rate: 6.75, expected: 3375000, dividend: 'Cuối kỳ', startDate: '15/01/2025', endDate: '15/01/2026', duration: '3 tháng', beforeTax: 50000000, tax: 0, afterTax: 50000000, account: 'Tiểu khoản 1' },
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.code}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.name}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.manager}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.package}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.status}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap text-xs">{row.policy}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.initialAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.currentAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.rate}%/năm</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.expected / 1000).toFixed(0)}K</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.dividend}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.startDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.endDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.duration}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.beforeTax / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.tax}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.afterTax / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.account}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Bảng 4: Hợp đồng INFY Linh hoạt, Tiềm năng */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">💜 Bảng 4: Hợp đồng INFY Linh hoạt, Tiềm năng</h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                        <table className="w-full text-xs border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                            <tr>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã Hợp đồng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tên khách hàng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Cán bộ quản lý</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Gói INFY</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Trạng thái hợp đồng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã chính sách</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đầu tư ban đầu</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đang đầu tư</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ suất lợi tức</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Lợi tức kỳ vọng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Thời điểm nhận cổ tức</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày bắt đầu</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày kết thúc</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Kỳ hạn</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị nhận được trước thuế</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Thuế TNCN</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị nhận được sau thuế</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài khoản nhận tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {[
                              { code: 'LH2401', manager: '1234 - Dõ Thanh Hà', package: 'Flexible', status: 'Phát sinh mới', policy: '12T_CK_CD_INFY/03_CK_LH_INFY', initialAmount: 25000000, currentAmount: 25000000, rate: 6.2, expected: 1550000, dividend: 'Hàng tháng', startDate: '20/11/2024', endDate: '20/11/2025', duration: '3 tháng', beforeTax: 25000000, tax: 0, afterTax: 25000000, account: 'Tiểu khoản 1' },
                              { code: 'LH2402', manager: '1234 - Dõ Thanh Hà', package: 'Flexible', status: 'Chờ xử lý', policy: '12T_CK_CD_INFY/03_CK_LH_INFY', initialAmount: 40000000, currentAmount: 40000000, rate: 6.3, expected: 2520000, dividend: 'Cuối kỳ', startDate: '10/12/2024', endDate: '10/12/2025', duration: '3 tháng', beforeTax: 40000000, tax: 0, afterTax: 40000000, account: 'Tiểu khoản 1' },
                              { code: 'LH2403', manager: '1234 - Dõ Thanh Hà', package: 'Flexible', status: 'Chờ ngày bắt đầu', policy: '12T_CK_CD_INFY/03_CK_LH_INFY', initialAmount: 35000000, currentAmount: 35000000, rate: 6.25, expected: 2187500, dividend: 'Hàng tháng', startDate: '05/01/2025', endDate: '05/01/2026', duration: '3 tháng', beforeTax: 35000000, tax: 0, afterTax: 35000000, account: 'Tiểu khoản 1' },
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.code}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.name}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.manager}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.package}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.status}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap text-xs">{row.policy}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.initialAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.currentAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.rate}%/năm</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.expected / 1000).toFixed(0)}K</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.dividend}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.startDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.endDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.duration}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.beforeTax / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.tax}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.afterTax / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.account}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Bảng 5: Ứng tiền INFY */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">💰 Bảng 5: Ứng tiền INFY</h3>
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                        <table className="w-full text-xs border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                            <tr>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã hợp đồng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tên khách hàng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Cán bộ quản lý</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đang đầu tư</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền ứng ban đầu</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền đã hoàn trả</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền cần hoàn trả</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày ứng tiền</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày đến hạn hoàn trả</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số ngày ứng tiền</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí (%/năm)</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí tạm tính</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tài khoản nhận tiền ứng</th>
                              <th className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {[
                              { code: 'UT2501', manager: '1234 - Dõ Thanh Hà', investAmount: 50000000, advanceAmount: 15000000, repaid: 5000000, needRepay: 10000000, advanceDate: '15/10/2024', dueDate: '15/01/2025', days: 92, fee: 2.5, feeCalc: 96250, account: 'Tiểu khoản 1', status: 'Hiệu lực' },
                              { code: 'UT2502', manager: '1234 - Dõ Thanh Hà', investAmount: 75000000, advanceAmount: 25000000, repaid: 10000000, needRepay: 15000000, advanceDate: '20/10/2024', dueDate: '20/01/2025', days: 92, fee: 2.75, feeCalc: 175062, account: 'Tiểu khoản 1', status: 'Hiệu lực' },
                              { code: 'UT2503', manager: '1234 - Dõ Thanh Hà', investAmount: 60000000, advanceAmount: 18000000, repaid: 0, needRepay: 18000000, advanceDate: '01/11/2024', dueDate: '01/02/2025', days: 92, fee: 2.6, feeCalc: 121800, account: 'Tiểu khoản 1', status: 'Hiệu lực' },
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.code}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{selectedCustomer.name}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.manager}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.investAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.advanceAmount / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.repaid / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.needRepay / 1000000).toFixed(0)}M</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.advanceDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.dueDate}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.days} ngày</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.fee}%</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{(row.feeCalc / 1000).toFixed(0)}K</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.account}</td>
                                <td className="border border-slate-200 dark:border-slate-700 px-1 py-3 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    </>
                    )}
                      </div>
                    )}

                    {/* Transaction History Tab */}
                    {subaccountDetailTab === 'history' && (
                      <div className="space-y-4">
                        {selectedSubaccount === 8 ? (
                          // Futures Transaction History for Tiểu khoản 8
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📝 Lịch sử giao dịch hợp đồng tương lai</h3>
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                              <table className="w-full text-xs border-collapse">
                                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                  <tr>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã hợp đồng</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại hợp đồng</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày đáo hạn</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Vị thế</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá mở vị thế</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Khối lượng</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá hiện tại</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Lợi/Lỗ tạm tính</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Thời gian giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại lệnh</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá khớp</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí giao dịch</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {[
                                    { code: 'PS126xx', type: 'Futures', expiry: '10/02/2025', position: 'Long', openPrice: 1250, volume: 5, currentPrice: 1260, pnl: 5000000, tradingTime: '05/02/2025', orderType: 'ATC', execPrice: 1250, fee: 50000 },
                                    { code: 'PS127xx', type: 'Futures', expiry: '10/02/2025', position: 'Short', openPrice: 1260, volume: 3, currentPrice: 1270, pnl: -3000000, tradingTime: '05/02/2025', orderType: 'LO', execPrice: 1260, fee: 30000 },
                                    { code: 'PS128xx', type: 'Futures', expiry: '10/02/2025', position: 'Long', openPrice: 1270, volume: 4, currentPrice: 1280, pnl: 2000000, tradingTime: '05/02/2025', orderType: 'PLO', execPrice: 1270, fee: 20000 },
                                    { code: 'PS126xx', type: 'Futures', expiry: '10/02/2025', position: 'Short', openPrice: 1280, volume: 4, currentPrice: 1240, pnl: 4000000, tradingTime: '05/02/2025', orderType: 'MAK', execPrice: 1280, fee: 40000 },
                                    { code: 'PS127xx', type: 'Futures', expiry: '10/02/2025', position: 'Long', openPrice: 1240, volume: 6, currentPrice: 1300, pnl: 6000000, tradingTime: '05/02/2025', orderType: 'MOK', execPrice: 1240, fee: 60000 },
                                    { code: 'PS128xx', type: 'Futures', expiry: '10/02/2025', position: 'Short', openPrice: 1300, volume: 5, currentPrice: 1310, pnl: -5000000, tradingTime: '05/02/2025', orderType: 'ATC', execPrice: 1300, fee: 50000 },
                                    { code: 'PS126xx', type: 'Futures', expiry: '10/02/2025', position: 'Long', openPrice: 1310, volume: 3, currentPrice: 1320, pnl: 3000000, tradingTime: '05/02/2025', orderType: 'PLO', execPrice: 1310, fee: 30000 },
                                    { code: 'PS127xx', type: 'Futures', expiry: '10/02/2025', position: 'Short', openPrice: 1320, volume: 2, currentPrice: 1330, pnl: -2000000, tradingTime: '05/02/2025', orderType: 'MOK', execPrice: 1320, fee: 20000 },
                                    { code: 'PS128xx', type: 'Futures', expiry: '10/02/2025', position: 'Long', openPrice: 1330, volume: 4, currentPrice: 1340, pnl: 4000000, tradingTime: '05/02/2025', orderType: 'MOK', execPrice: 1330, fee: 40000 },
                                    { code: 'PS129xx', type: 'Futures', expiry: '10/02/2025', position: 'Short', openPrice: 1340, volume: 6, currentPrice: 1350, pnl: -6000000, tradingTime: '05/02/2025', orderType: 'PLO', execPrice: 1340, fee: 60000 },
                                  ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.code}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.type}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.expiry}</td>
                                      <td className={`border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap font-semibold ${row.position === 'Long' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {row.position}
                                      </td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.openPrice}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.volume}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.currentPrice}</td>
                                      <td className={`border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap text-right font-semibold ${row.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {(row.pnl / 1000000).toFixed(1)}M
                                      </td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.tradingTime}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.orderType}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.execPrice}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.fee / 1000).toFixed(0)}K</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : selectedSubaccount === 1 ? (
                          // Stock Transaction History for Tiểu khoản 1
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📝 Lịch sử giao dịch</h3>
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                              <table className="w-full text-xs border-collapse">
                                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                  <tr>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại lệnh</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã chứng khoán</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Khối lượng</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Trạng thái</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã lệnh</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {[
                                    { date: '04/05/2024', type: 'Mua', symbol: 'FPT', volume: 100, price: 68.5, value: 6850000, fee: 10275, status: 'Thành công', orderId: 'ORD001' },
                                    { date: '03/05/2024', type: 'Bán', symbol: 'VNM', volume: 50, price: 95.2, value: 4760000, fee: 7140, status: 'Thành công', orderId: 'ORD002' },
                                    { date: '02/05/2024', type: 'Mua', symbol: 'GAS', volume: 200, price: 31.2, value: 6240000, fee: 9360, status: 'Thành công', orderId: 'ORD003' },
                                    { date: '01/05/2024', type: 'Mua', symbol: 'CTG', volume: 150, price: 42.8, value: 6420000, fee: 9630, status: 'Thành công', orderId: 'ORD004' },
                                    { date: '30/04/2024', type: 'Bán', symbol: 'FPT', volume: 75, price: 68.0, value: 5100000, fee: 7650, status: 'Thành công', orderId: 'ORD005' },
                                    { date: '29/04/2024', type: 'Mua', symbol: 'BID', volume: 300, price: 28.5, value: 8550000, fee: 12825, status: 'Thành công', orderId: 'ORD006' },
                                    { date: '28/04/2024', type: 'Bán', symbol: 'ACB', volume: 100, price: 26.3, value: 2630000, fee: 3945, status: 'Thành công', orderId: 'ORD007' },
                                    { date: '27/04/2024', type: 'Mua', symbol: 'VJC', volume: 250, price: 35.8, value: 8950000, fee: 13425, status: 'Thành công', orderId: 'ORD008' },
                                    { date: '26/04/2024', type: 'Mua', symbol: 'MWG', volume: 50, price: 78.5, value: 3925000, fee: 5887, status: 'Thành công', orderId: 'ORD009' },
                                    { date: '25/04/2024', type: 'Bán', symbol: 'GAS', volume: 100, price: 31.5, value: 3150000, fee: 4725, status: 'Thành công', orderId: 'ORD010' },
                                  ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.date}</td>
                                      <td className={`border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap font-semibold ${row.type === 'Mua' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {row.type}
                                      </td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.symbol}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.volume}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.price.toFixed(1)}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.value / 1000000).toFixed(2)}M</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.fee / 1000).toFixed(1)}K</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap">
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-2xs font-semibold">
                                          {row.status}
                                        </span>
                                      </td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-2xs">{row.orderId}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          // Margin Transaction History for Tiểu khoản 3 & 6
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase">📝 Lịch sử giao dịch ký quỹ</h3>
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded">
                              <table className="w-full text-xs border-collapse">
                                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                  <tr>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại lệnh</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Mã chứng khoán</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Khối lượng</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Giá trị giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Loại ký quỹ</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Tỷ lệ ký quỹ</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Số tiền ký quỹ</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Lãi suất (%/năm)</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Ngày đến hạn</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Phí giao dịch</th>
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-3 text-left text-slate-900 dark:text-white font-semibold text-2xs">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {[
                                    { date: '04/05/2024', type: 'Mua', symbol: 'FPT', volume: 100, price: 68.5, value: 6850000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 2055000, rate: 9.5, dueDate: '04/06/2024', fee: 10275, status: 'Đang nắm giữ' },
                                    { date: '03/05/2024', type: 'Bán', symbol: 'VNM', volume: 50, price: 95.2, value: 4760000, marginType: 'Bảo trì', ratio: '25%', marginAmount: 1190000, rate: 9.0, dueDate: '03/06/2024', fee: 7140, status: 'Đã thanh toán' },
                                    { date: '02/05/2024', type: 'Mua', symbol: 'GAS', volume: 200, price: 31.2, value: 6240000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 1872000, rate: 9.5, dueDate: '02/06/2024', fee: 9360, status: 'Đang nắm giữ' },
                                    { date: '01/05/2024', type: 'Mua', symbol: 'CTG', volume: 150, price: 42.8, value: 6420000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 1926000, rate: 9.5, dueDate: '01/06/2024', fee: 9630, status: 'Đang nắm giữ' },
                                    { date: '30/04/2024', type: 'Bán', symbol: 'FPT', volume: 75, price: 68.0, value: 5100000, marginType: 'Bảo trì', ratio: '25%', marginAmount: 1275000, rate: 9.0, dueDate: '30/05/2024', fee: 7650, status: 'Đã thanh toán' },
                                    { date: '29/04/2024', type: 'Mua', symbol: 'BID', volume: 300, price: 28.5, value: 8550000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 2565000, rate: 9.5, dueDate: '29/05/2024', fee: 12825, status: 'Đang nắm giữ' },
                                    { date: '28/04/2024', type: 'Bán', symbol: 'ACB', volume: 100, price: 26.3, value: 2630000, marginType: 'Bảo trì', ratio: '25%', marginAmount: 657500, rate: 9.0, dueDate: '28/05/2024', fee: 3945, status: 'Đã thanh toán' },
                                    { date: '27/04/2024', type: 'Mua', symbol: 'VJC', volume: 250, price: 35.8, value: 8950000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 2685000, rate: 9.5, dueDate: '27/05/2024', fee: 13425, status: 'Đang nắm giữ' },
                                    { date: '26/04/2024', type: 'Mua', symbol: 'MWG', volume: 50, price: 78.5, value: 3925000, marginType: 'Ban đầu', ratio: '30%', marginAmount: 1177500, rate: 9.5, dueDate: '26/05/2024', fee: 5887, status: 'Đang nắm giữ' },
                                    { date: '25/04/2024', type: 'Bán', symbol: 'GAS', volume: 100, price: 31.5, value: 3150000, marginType: 'Bảo trì', ratio: '25%', marginAmount: 787500, rate: 9.0, dueDate: '25/05/2024', fee: 4725, status: 'Đã thanh toán' },
                                  ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.date}</td>
                                      <td className={`border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap font-semibold ${row.type === 'Mua' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {row.type}
                                      </td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap font-semibold">{row.symbol}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.volume}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.price.toFixed(1)}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.value / 1000000).toFixed(2)}M</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-sm">{row.marginType}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right font-semibold">{row.ratio}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.marginAmount / 1000000).toFixed(2)}M</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{row.rate}%</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap">{row.dueDate}</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 text-slate-900 dark:text-white whitespace-nowrap text-right">{(row.fee / 1000).toFixed(1)}K</td>
                                      <td className="border border-slate-200 dark:border-slate-700 px-2 py-2 whitespace-nowrap">
                                        <span className={`inline-block px-2 py-1 rounded text-2xs font-semibold ${row.status === 'Đang nắm giữ' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                          {row.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* To-do List Tab - Action Groups */}
      {pageTab === 'todo' && (
        <div className="space-y-6">
          {!selectedActionTitle ? (
            <div className="bg-white dark:bg-slate-950 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🎯 Nhóm hành động cần thực hiện</h2>
                <div className="space-y-3">
                  {(() => {
                    const actionGroups = new Map<string, { action: any; count: number; priority: string; icon: string }>();

                    mockCustomers.forEach(customer => {
                      customer.nextBestActions.forEach(action => {
                        const key = action.title;
                        if (!actionGroups.has(key)) {
                          actionGroups.set(key, {
                            action,
                            count: 0,
                            priority: action.priority,
                            icon: action.icon
                          });
                        }
                        const group = actionGroups.get(key)!;
                        group.count += 1;
                      });
                    });

                    return Array.from(actionGroups.values()).map((group) => (
                      <div
                        key={group.action.id}
                        onClick={() => setSelectedActionTitle(group.action.title)}
                        className={`flex items-center justify-between p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${
                          group.priority === 'high'
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40'
                            : group.priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-2xl">{group.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">{group.action.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{group.action.description}</p>
                          </div>
                        </div>
                        <span className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg">
                          {group.count}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-lg shadow">
              <div className="p-6">
                <button
                  onClick={() => setSelectedActionTitle(null)}
                  className="mb-6 flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold"
                >
                  ← Quay lại danh sách
                </button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">👥 Danh sách khách hàng - {selectedActionTitle}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Tên khách hàng</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Điện thoại</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Phân loại</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Broker quản lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockCustomers
                        .filter(customer =>
                          customer.nextBestActions.some(action => action.title === selectedActionTitle)
                        )
                        .map((customer) => (
                          <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{customer.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{customer.email}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{customer.phone}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                customer.classification === 'VIP' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                customer.classification === 'Mass' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                customer.classification === 'Newbie' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                                {customer.classification}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/brokers/${customer.brokerCode}`);
                                }}
                                className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold hover:underline"
                              >
                                {customer.brokerName}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
