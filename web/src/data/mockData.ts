import {
  generateCustomer,
  generateTransaction,
  generateKPI,
  generatePerformanceReport,
  generateMockStaff,
  type Customer,
  type Transaction,
  type KPI,
  type PerformanceReport,
  type StaffPotential,
  type BirthdayReport,
  type MarginReport,
  type Staff,
} from './generators';

// Notifications
export interface AppNotification {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'margin' | 'kpi' | 'support' | 'staff' | 'customer' | 'market';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

// Generate mock customers
export const mockCustomers: Customer[] = Array.from({ length: 150 }, () => generateCustomer());

// Generate mock staff
export const mockStaff: Staff[] = generateMockStaff();

// Generate transactions for customers
export const mockTransactions: Transaction[] = mockCustomers.flatMap((customer) =>
  Array.from(
    { length: Math.floor(Math.random() * 50) },
    () => generateTransaction(customer.id)
  )
);

// Generate KPIs
export const mockKPIs: KPI[] = Array.from({ length: 8 }, () => generateKPI());

// Generate performance reports
export const mockPerformanceReports: PerformanceReport[] = Array.from(
  { length: 50 },
  () => generatePerformanceReport()
);

// Support cases
export interface SupportCase {
  id: string;
  customerId: string;
  customerName: string;
  brokerName: string;
  type: 'Khiếu nại' | 'Hỗ trợ' | 'Tư vấn';
  status: 'Mở' | 'Đang xử lý' | 'Đã giải quyết';
  createdDate: string;
  resolvedDate?: string;
  sentiment: 'Tích cực' | 'Trung lập' | 'Tiêu cực';
}

export const mockSupportCases: SupportCase[] = [
  {
    id: '1',
    customerId: 'KH001',
    customerName: 'Nguyễn Văn A',
    brokerName: 'Nguyễn Minh Tuấn',
    type: 'Khiếu nại',
    status: 'Đã giải quyết',
    createdDate: '2024-04-20',
    resolvedDate: '2024-04-22',
    sentiment: 'Tích cực',
  },
  {
    id: '2',
    customerId: 'KH002',
    customerName: 'Trần Thị B',
    brokerName: 'Trần Thị Hoa',
    type: 'Hỗ trợ',
    status: 'Đang xử lý',
    createdDate: '2024-04-25',
    sentiment: 'Trung lập',
  },
  {
    id: '3',
    customerId: 'KH003',
    customerName: 'Lê Văn C',
    brokerName: 'Phạm Văn Đức',
    type: 'Tư vấn',
    status: 'Mở',
    createdDate: '2024-04-28',
    sentiment: 'Tiêu cực',
  },
  {
    id: '4',
    customerId: 'KH004',
    customerName: 'Đỗ Thị D',
    brokerName: 'Lê Quang Minh',
    type: 'Khiếu nại',
    status: 'Đã giải quyết',
    createdDate: '2024-04-18',
    resolvedDate: '2024-04-19',
    sentiment: 'Tích cực',
  },
  {
    id: '5',
    customerId: 'KH005',
    customerName: 'Hoàng Văn E',
    brokerName: 'Võ Thị Mai',
    type: 'Hỗ trợ',
    status: 'Mở',
    createdDate: '2024-04-26',
    sentiment: 'Tiêu cực',
  },
];

// Market news and recommendations
export interface MarketNews {
  id: string;
  title: string;
  content: string;
  source: string;
  date: string;
  category: 'VSD' | 'HNX' | 'HOSE' | 'Tin tức chứng khoán';
}

// Staff potential for promotion
export const mockStaffPotential: StaffPotential[] = [
  {
    id: '1',
    staffName: 'Nguyễn Văn A',
    currentLevel: 'Cộng tác viên',
    achievement: 125,
    daysInCompany: 180,
    commission: 2500000000,
    recommendation: 'Sẵn sàng lên Nhân viên cấp 1',
  },
  {
    id: '2',
    staffName: 'Trần Thị B',
    currentLevel: 'Cộng tác viên',
    achievement: 110,
    daysInCompany: 150,
    commission: 2100000000,
    recommendation: 'Cần thêm 1-2 tháng nữa',
  },
  {
    id: '3',
    staffName: 'Phạm Văn C',
    currentLevel: 'Nhân viên cấp 1',
    achievement: 135,
    daysInCompany: 365,
    commission: 4200000000,
    recommendation: 'Sẵn sàng lên Nhân viên cấp 2',
  },
];

// Cooperator potential for staff level 1
export const mockCooperatorPotential: StaffPotential[] = [
  {
    id: '1',
    staffName: 'Hoàng Minh D',
    currentLevel: 'Khách hàng hoạt động',
    achievement: 95,
    daysInCompany: 90,
    commission: 1800000000,
    recommendation: 'Tiềm năng cao để tuyển làm Cộng tác viên',
  },
  {
    id: '2',
    staffName: 'Lê Quốc E',
    currentLevel: 'Khách hàng hoạt động',
    achievement: 85,
    daysInCompany: 60,
    commission: 1500000000,
    recommendation: 'Cần theo dõi thêm',
  },
];

// Birthday report
export const mockBirthdayReport: BirthdayReport[] = [
  {
    id: '1',
    customerId: 'KH001',
    customerName: 'Trương Văn A',
    dob: '1980-05-05',
    daysUntilBirthday: 5,
    classification: 'VIP',
    brokerName: 'Nguyễn Minh Tuấn',
    phone: '0901234567',
    customerCareScenario: 'Tặng hoa & Gọi điện',
    status: 'Đang duyệt ngân sách',
  },
  {
    id: '2',
    customerId: 'KH002',
    customerName: 'Trần Thị B',
    dob: '1992-05-02',
    daysUntilBirthday: 2,
    classification: 'Mass',
    brokerName: 'Trần Thị Hoa',
    phone: '0987654321',
    customerCareScenario: 'Tặng voucher 500k',
    status: 'Đã chuẩn bị mã',
  },
  {
    id: '3',
    customerId: 'KH003',
    customerName: 'Lê Văn C',
    dob: '1985-05-07',
    daysUntilBirthday: 7,
    classification: 'Newbie',
    brokerName: 'Phạm Văn Đức',
    phone: '0912345678',
    customerCareScenario: 'Gửi Zalo ZNS tự động',
    status: 'Chờ đến ngày',
  },
  {
    id: '4',
    customerId: 'KH004',
    customerName: 'Đỗ Thị D',
    dob: '1988-05-12',
    daysUntilBirthday: 12,
    classification: 'VIP',
    brokerName: 'Lê Quang Minh',
    phone: '0923456789',
    customerCareScenario: 'Tặng hoa & Gọi điện',
    status: 'Đã chuẩn bị mã',
  },
  {
    id: '5',
    customerId: 'KH005',
    customerName: 'Hoàng Văn E',
    dob: '1995-05-18',
    daysUntilBirthday: 18,
    classification: 'Dormant',
    brokerName: 'Võ Thị Mai',
    phone: '0934567890',
    customerCareScenario: 'Gửi Zalo ZNS tự động',
    status: 'Chờ đến ngày',
  },
].map((item, index) => ({ ...item, stt: index + 1 }));

// Margin expiring report
export const mockMarginReport: MarginReport[] = [
  {
    id: '1',
    // Group A: Customer & Manager Info
    customerName: 'Lê Văn I',
    accountNumber: 'A561226',
    brokerName: 'Nguyễn Minh Tuấn',
    branch: 'Chi nhánh Hà Nội',

    // Group B: Margin Ratios Status
    currentMarginRatio: 82,
    maintenanceRatio: 85,
    forceSellRatio: 80,
    status: 'Warning',

    // Group C: Financial Metrics
    totalAssetValue: 5000000000,
    totalDebt: 1500000000,
    equity: 3500000000,
    callAmount: 150000000,
    sellAmountToCover: 200000000,

    // Group D: Timeline
    callDate: '2026-04-27',
    dueDate: '2026-04-29',
    expectedForceSellDate: '2026-04-30',
  },
  {
    id: '2',
    // Group A: Customer & Manager Info
    customerName: 'Đỗ Thị J',
    accountNumber: 'B145506',
    brokerName: 'Trần Thị Hoa',
    branch: 'Chi nhánh TP. HCM',

    // Group B: Margin Ratios Status
    currentMarginRatio: 78,
    maintenanceRatio: 85,
    forceSellRatio: 80,
    status: 'Call Margin',

    // Group C: Financial Metrics
    totalAssetValue: 3000000000,
    totalDebt: 800000000,
    equity: 2200000000,
    callAmount: 120000000,
    sellAmountToCover: 180000000,

    // Group D: Timeline
    callDate: '2026-04-26',
    dueDate: '2026-04-28',
    expectedForceSellDate: '2026-04-29',
  },
  {
    id: '3',
    // Group A: Customer & Manager Info
    customerName: 'Vũ Văn K',
    accountNumber: 'C789016',
    brokerName: 'Phạm Văn Đức',
    branch: 'Chi nhánh Đà Nẵng',

    // Group B: Margin Ratios Status
    currentMarginRatio: 75,
    maintenanceRatio: 85,
    forceSellRatio: 80,
    status: 'Force Sell',

    // Group C: Financial Metrics
    totalAssetValue: 8000000000,
    totalDebt: 2500000000,
    equity: 5500000000,
    callAmount: 450000000,
    sellAmountToCover: 600000000,

    // Group D: Timeline
    callDate: '2026-04-28',
    dueDate: '2026-04-30',
    expectedForceSellDate: '2026-05-01',
  },
];

export const mockMarketNews: MarketNews[] = [
  {
    id: '1',
    title: 'VNM tăng giá mạnh do nhu cầu tiêu dùng tăng',
    content: 'Cổ phiếu VNM tăng 5% hôm nay do bán hàng quý 1 vượt dự kiến',
    source: 'HOSE',
    date: '2024-04-29',
    category: 'HOSE',
  },
  {
    id: '2',
    title: 'HPG giảm 3% do giá thép toàn cầu suy yếu',
    content: 'Giá thép quốc tế giảm làm áp lực lên cổ phiếu HPG',
    source: 'HNX',
    date: '2024-04-28',
    category: 'HNX',
  },
];

// Curated broker data for dashboard insights
export const mockBrokerChartData = [
  { name: 'Nguyễn Minh Tuấn', hoaHong: 4.8, soLenh: 4200, khachHang: 42, duNoMargin: 85 },
  { name: 'Trần Thị Hoa', hoaHong: 2.1, soLenh: 1850, khachHang: 28, duNoMargin: 42 },
  { name: 'Phạm Văn Đức', hoaHong: 1.9, soLenh: 1720, khachHang: 25, duNoMargin: 38 },
  { name: 'Lê Quang Minh', hoaHong: 1.7, soLenh: 1580, khachHang: 22, duNoMargin: 35 },
  { name: 'Võ Thị Mai', hoaHong: 1.5, soLenh: 1420, khachHang: 20, duNoMargin: 32 },
  { name: 'Hoàng Văn Long', hoaHong: 1.3, soLenh: 1280, khachHang: 18, duNoMargin: 28 },
  { name: 'Đặng Thị Linh', hoaHong: 1.1, soLenh: 1100, khachHang: 15, duNoMargin: 24 },
  { name: 'Bùi Minh Khoa', hoaHong: 0.9, soLenh: 980, khachHang: 13, duNoMargin: 20 },
  { name: 'Hồ Thị Thanh', hoaHong: 0.7, soLenh: 820, khachHang: 10, duNoMargin: 16 },
  { name: 'Dương Văn Hải', hoaHong: 0.5, soLenh: 650, khachHang: 8, duNoMargin: 12 },
];

// Mock notifications for inbox
export const mockNotifications: AppNotification[] = [
  {
    id: '1',
    priority: 'urgent',
    category: 'margin',
    title: 'Khách hàng cần Force Sell',
    description: '3 khách hàng cần Force Sell trong 24h',
    time: '2 phút trước',
    isRead: false,
  },
  {
    id: '2',
    priority: 'urgent',
    category: 'kpi',
    title: 'Phí HHMG chưa đạt kế hoạch',
    description: 'Phí HHMG chỉ đạt 45% kế hoạch tháng',
    time: '5 phút trước',
    isRead: false,
  },
  {
    id: '3',
    priority: 'high',
    category: 'support',
    title: 'Khiếu nại chờ xử lý',
    description: '3 khiếu nại đang chờ xử lý quá 48h',
    time: '15 phút trước',
    isRead: false,
  },
  {
    id: '4',
    priority: 'high',
    category: 'staff',
    title: 'Nhân viên sẵn sàng lên cấp',
    description: 'Nguyễn Văn A sẵn sàng lên Nhân viên cấp 1',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: '5',
    priority: 'medium',
    category: 'customer',
    title: 'Khách hàng có sinh nhật sắp tới',
    description: '5 khách hàng có sinh nhật trong 7 ngày tới',
    time: '2 giờ trước',
    isRead: false,
  },
  {
    id: '6',
    priority: 'medium',
    category: 'customer',
    title: 'Khách hàng mới mở tài khoản',
    description: '8 khách hàng mới mở tài khoản hôm nay',
    time: '3 giờ trước',
    isRead: true,
  },
  {
    id: '7',
    priority: 'medium',
    category: 'margin',
    title: 'Khách hàng Call Margin',
    description: '10 khách hàng đang ở trạng thái Call Margin',
    time: '4 giờ trước',
    isRead: true,
  },
  {
    id: '8',
    priority: 'low',
    category: 'market',
    title: 'VNM tăng giá mạnh',
    description: 'VNM tăng 5% do kết quả kinh doanh Q1 tích cực',
    time: 'Hôm qua',
    isRead: true,
  },
  {
    id: '9',
    priority: 'low',
    category: 'market',
    title: 'HPG giảm theo thép thế giới',
    description: 'HPG giảm 3% theo đà giảm của thép thế giới',
    time: 'Hôm qua',
    isRead: true,
  },
  {
    id: '10',
    priority: 'low',
    category: 'kpi',
    title: 'Team đạt kế hoạch tháng',
    description: 'Team đã đạt 92% kế hoạch tháng',
    time: '2 ngày trước',
    isRead: true,
  },
];
