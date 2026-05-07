import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCustomers } from '../data/mockData';
import { ChevronLeft } from 'lucide-react';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const customer = mockCustomers.find(c => c.email === id);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy khách hàng</h1>
          <button
            onClick={() => navigate('/customers')}
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'trading', label: 'Hiệu suất giao dịch' },
    { id: 'portfolio', label: 'Danh mục' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'history', label: 'Lịch sử' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/customers')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <p className="text-accent-100">{customer.email}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-accent-500/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs text-accent-100 font-bold uppercase">NAV</p>
              <p className="text-2xl font-bold mt-1">{(customer.nav / 1000000).toFixed(0)}M</p>
            </div>
            <div className="bg-accent-500/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs text-accent-100 font-bold uppercase">Lãi nhuận</p>
              <p className={`text-2xl font-bold mt-1 ${customer.profit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {customer.profit >= 0 ? '+' : ''}{(customer.profit / 1000000).toFixed(0)}M
              </p>
            </div>
            <div className="bg-accent-500/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs text-accent-100 font-bold uppercase">Số lệnh</p>
              <p className="text-2xl font-bold mt-1">{customer.totalTrades}</p>
            </div>
            <div className="bg-accent-500/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-xs text-accent-100 font-bold uppercase">Trạng thái</p>
              <p className="text-lg font-bold mt-1">
                {customer.activeStatus ? '✓ Hoạt động' : '✗ Tạm ngừng'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Financial Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Buying Power */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">Sức mua hiện tại</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {((customer.totalBalance / customer.nav) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">của tổng tài sản</p>
              </div>

              {/* Total Margin Debt */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">Tổng dư nợ Margin</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {(customer.nav * 0.15 / 1000000000).toFixed(2)}T
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">đang vay</p>
              </div>

              {/* Upcoming Margin Due */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">Margin sắp đến hạn</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {(customer.nav * 0.05 / 1000000000).toFixed(2)}T
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">trong 7 ngày</p>
              </div>

              {/* App Login Frequency */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">Đăng nhập App</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {(Math.random() * 20 + 5).toFixed(0)} lần
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">tháng này</p>
              </div>

              {/* Churn Risk */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">Khả năng rời bỏ</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {Math.floor(Math.random() * 60 + 10)}%
                  </p>
                  <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Trung bình</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">rủi ro</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">👤 Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Tên</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Điện thoại</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Ngày sinh</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.dob}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Giới tính</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Khu vực</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.region}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">💳 Chi tiết tài khoản</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Số tài khoản</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Ngày mở tài khoản</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.accountOpenDate}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Phân loại khách hàng</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.classification}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">NAV hiện tại</p>
                  <p className="font-bold text-primary-600 dark:text-primary-400 text-lg">{(customer.nav / 1000000000).toFixed(2)} tỷ đ</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Số dư khả dụng</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{(customer.totalBalance / 1000000000).toFixed(2)} tỷ đ</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">CCCD</p>
                  <p className="font-medium text-slate-900 dark:text-white">{customer.idCard}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trading Performance Tab */}
        {activeTab === 'trading' && (
          <div className="space-y-8">
            {/* Trading Performance */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">📊 Hiệu suất giao dịch</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Tổng số lệnh</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{customer.totalTrades}</p>
                </div>
                <div className={`${customer.profit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-4`}>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Lãi/Lỗ</p>
                  <p className={`text-3xl font-bold ${customer.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {customer.profit >= 0 ? '+' : ''}{(customer.profit / 1000000000).toFixed(2)}T
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Tỷ lệ lợi nhuận</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {customer.nav > 0
                      ? ((customer.profit / customer.nav) * 100).toFixed(1)
                      : '0'
                    }%
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Giá trị trung bình/lệnh</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {customer.totalTrades > 0
                      ? ((customer.totalBalance * 1000000) / customer.totalTrades / 1000000).toFixed(1)
                      : '0'
                    }M
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Profile & Preferences */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">🎯 Khẩu vị & Sở thích</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Khẩu vị rủi ro</p>
                  <p className="text-slate-900 dark:text-white">Cân bằng</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Sản phẩm ưu tiên</p>
                  <p className="text-slate-900 dark:text-white">Chứng khoán, Trái phiếu, Quỹ mở</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Ngành nghề quan tâm</p>
                  <p className="text-slate-900 dark:text-white">TMĐT, Bất động sản, Công nghệ</p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Top cổ phiếu được theo dõi gần đây</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { symbol: 'VNM', trend: 'up' },
                      { symbol: 'FPT', trend: 'up' },
                      { symbol: 'HPG', trend: 'down' },
                      { symbol: 'ACB', trend: 'up' },
                      { symbol: 'BID', trend: 'up' },
                      { symbol: 'CTG', trend: 'down' },
                    ].map(stock => (
                      <div
                        key={stock.symbol}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          stock.trend === 'up'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {stock.symbol}
                        <span className="text-sm">{stock.trend === 'up' ? '↑' : '↓'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">📈 Danh mục cổ phiếu đang nắm giữ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { symbol: 'VNM', quantity: '5,000 cp', performance: '+2.5%', positive: true },
                { symbol: 'HPG', quantity: '3,200 cp', performance: '-1.2%', positive: false },
                { symbol: 'FPT', quantity: '2,100 cp', performance: '+4.1%', positive: true },
                { symbol: 'ACB', quantity: '1,500 cp', performance: '+1.8%', positive: true },
                { symbol: 'MBB', quantity: '800 cp', performance: '-0.9%', positive: false },
                { symbol: 'CTG', quantity: '2,500 cp', performance: '+3.2%', positive: true },
              ].map(stock => (
                <div key={stock.symbol} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{stock.symbol}</p>
                  <p className="font-bold text-slate-900 dark:text-white mb-2">{stock.quantity}</p>
                  <p className={`text-sm font-semibold ${stock.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.performance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">🛍️ Sản phẩm</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Chứng khoán', active: true },
                { name: 'Phái sinh', active: true },
                { name: 'INFY Thịnh vượng', active: true },
                { name: 'Trái phiếu', active: false },
                { name: 'Quỹ mở (ETF)', active: false },
                { name: 'INFY Lịnh hoạt', active: false },
              ].map(product => (
                <div
                  key={product.name}
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    product.active
                      ? 'bg-accent-600 dark:bg-accent-700 text-white'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">📞 Lịch sử liên hệ gần đây</h2>
            <div className="space-y-2">
              {[
                { action: 'Cuộc gọi tư vấn', date: '28/04/2024' },
                { action: 'Gửi khuyến nghị', date: '26/04/2024' },
                { action: 'Email giáo dục thị trường', date: '25/04/2024' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-slate-900 dark:text-white">{item.action}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
