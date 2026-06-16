import { useParams, useNavigate } from 'react-router-dom';
import { mockCustomers, mockStaff } from '../data/mockData';
import { getClassificationLabel } from '../data/generators';

export function BrokerDetailPage() {
  const { brokerCode } = useParams<{ brokerCode: string }>();
  const navigate = useNavigate();

  if (!brokerCode) {
    return <div>Invalid broker code</div>;
  }

  // Get staff data based on broker code
  const staff = mockStaff.find(s => s.brokerCode === brokerCode);

  if (!staff) {
    return <div>Broker not found</div>;
  }

  // Get customers managed by this broker
  const managedCustomers = mockCustomers.filter(c => c.brokerCode === brokerCode);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    return `${(value / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden m-6">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{staff.name}</h1>
            <p className="text-accent-100 text-sm">{staff.position}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📋 Thông tin cơ bản</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Họ và tên</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Mã nhân viên</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.brokerCode}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Loại hình sale</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.salesType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Chức danh</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.position}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Ngày onboard</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.onboardDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Email VPS</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Ngày chính thức gần nhất</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.latestOfficialDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Quản lý trực tiếp</p>
              <p className="font-medium text-slate-900 dark:text-white mt-0.5">{staff.directManager}</p>
            </div>
          </div>
        </div>

        {/* NAV Information */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">💰 Thông tin NAV</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">NAV chuyển đi</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(staff.navTransferredOut)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">NAV chuyển đến</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(staff.navTransferredIn)}</p>
            </div>
          </div>
        </div>

        {/* Customer Transfer Information */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">👥 Thông tin chuyển khách hàng</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Khách hàng chuyển đến</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{staff.customersTransferredIn} khách</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Khách hàng chuyển đi</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{staff.customersTransferredOut} khách</p>
            </div>
          </div>
        </div>

        {/* Managed Customers */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📊 Khách hàng được quản lý ({managedCustomers.length})</h2>
          {managedCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Tên khách hàng</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">NAV</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Phân loại</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {managedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => navigate('/customers', { state: { selectedCustomer: customer } })}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{customer.email}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {customer.nav >= 1000000000
                          ? `${(customer.nav / 1000000000).toFixed(1)}B`
                          : `${(customer.nav / 1000000).toFixed(0)}M`
                        }
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.classification === 'S1' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          customer.classification === 'S2' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          customer.classification === 'S3' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' :
                          customer.classification === 'S4' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          customer.classification === 'S5' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          customer.classification === 'S6' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {getClassificationLabel(customer.classification as any)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={customer.activeStatus ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                          {customer.activeStatus ? '✓ Hoạt động' : '✗ Không hoạt động'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">Không có khách hàng được quản lý</p>
          )}
        </div>
      </div>
    </div>
  );
}
