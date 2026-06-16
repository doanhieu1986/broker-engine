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

// Generate mock customers with assigned ranking for variance
export const mockCustomers: Customer[] = Array.from({ length: 150 }, (_, index) => {
  const customer = generateCustomer();
  // Create hierarchy: top 10 have significant but not extreme differences
  if (index < 10) {
    // Top 10: 50B down to 40B with steady decline
    customer.nav = Math.floor((50 - index * 1) * 1000000000);
  } else if (index < 30) {
    // Next 20: 3-8B NAV (closer to top 10)
    customer.nav = Math.floor(3000000000 + Math.random() * 5000000000);
  } else {
    // Rest: regular with 100M-1B NAV
    customer.nav = Math.floor(100000000 + Math.random() * 900000000);
  }
  // Recalculate AUM based on new NAV
  customer.aum = Math.floor(customer.nav * (1.5 + Math.random() * 1.5));
  return customer;
});

// Generate mock staff
export const mockStaff: Staff[] = generateMockStaff();

// Generate transactions for customers with massive variance based on NAV
export const mockTransactions: Transaction[] = mockCustomers.flatMap((customer) => {
  // Create massive transaction volume variance - use NAV as multiplier
  const navInBillions = customer.nav / 1000000000;
  let transactionCount: number;

  if (customer.nav > 30000000000) {
    // Top tier customers (30B+): proportional to NAV
    transactionCount = Math.floor(navInBillions * 1);
  } else if (customer.nav > 10000000000) {
    // High tier (10-30B): proportional to NAV
    transactionCount = Math.floor(navInBillions * 0.7);
  } else if (customer.nav > 1000000000) {
    // Mid tier (1-10B): proportional to NAV
    transactionCount = Math.floor(navInBillions * 0.4);
  } else {
    // Regular (< 1B): proportional to NAV
    transactionCount = Math.floor(navInBillions * 0.5);
  }

  // Ensure at least some transactions
  transactionCount = Math.max(transactionCount, 1);

  return Array.from(
    { length: transactionCount },
    () => {
      const transaction = generateTransaction(customer.id);
      // Adjust commission multiplier for high NAV customers (minimal multiplier)
      transaction.commission = Math.floor(transaction.commission * (1 + navInBillions * 0.01));
      transaction.amount = Math.floor(transaction.amount * (1 + navInBillions * 0.01));
      return transaction;
    }
  );
});

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
    classification: 'S1',
    brokerName: 'Nguyễn Minh Tuấn',
    phone: '0901234567',
    email: 'truong.a@example.com',
    customerCareScenario: 'Tặng hoa & Gọi điện',
    status: 'Đang duyệt ngân sách',
  },
  {
    id: '2',
    customerId: 'KH002',
    customerName: 'Trần Thị B',
    dob: '1992-05-02',
    daysUntilBirthday: 2,
    classification: 'S3',
    brokerName: 'Trần Thị Hoa',
    phone: '0987654321',
    email: 'tran.b@example.com',
    customerCareScenario: 'Tặng voucher 500k',
    status: 'Đã chuẩn bị mã',
  },
  {
    id: '3',
    customerId: 'KH003',
    customerName: 'Lê Văn C',
    dob: '1985-05-07',
    daysUntilBirthday: 7,
    classification: 'S5',
    brokerName: 'Phạm Văn Đức',
    phone: '0912345678',
    email: 'le.c@example.com',
    customerCareScenario: 'Gửi Zalo ZNS tự động',
    status: 'Chờ đến ngày',
  },
  {
    id: '4',
    customerId: 'KH004',
    customerName: 'Đỗ Thị D',
    dob: '1988-05-12',
    daysUntilBirthday: 12,
    classification: 'S2',
    brokerName: 'Lê Quang Minh',
    phone: '0923456789',
    email: 'do.d@example.com',
    customerCareScenario: 'Tặng hoa & Gọi điện',
    status: 'Đã chuẩn bị mã',
  },
  {
    id: '5',
    customerId: 'KH005',
    customerName: 'Hoàng Văn E',
    dob: '1995-05-18',
    daysUntilBirthday: 18,
    classification: 'S7',
    brokerName: 'Võ Thị Mai',
    phone: '0934567890',
    email: 'hoang.e@example.com',
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

// Calculate broker data dynamically from customers and transactions
function calculateBrokerChartData() {
  const brokerMetrics: Record<string, {
    code: string;
    name: string;
    hoaHong: number;
    soLenh: number;
    khachHang: number;
    duNoMargin: number;
    hoaHongKH: number;
    soLenhKH: number;
    khachHangKH: number;
    duNoMarginKH: number;
  }> = {};

  // Initialize broker metrics from customers
  mockCustomers.forEach(customer => {
    if (!brokerMetrics[customer.brokerCode]) {
      brokerMetrics[customer.brokerCode] = {
        code: customer.brokerCode,
        name: customer.brokerName,
        hoaHong: 0,
        soLenh: 0,
        khachHang: 0,
        duNoMargin: 0,
        hoaHongKH: 0,
        soLenhKH: 0,
        khachHangKH: 0,
        duNoMarginKH: 0,
      };
    }
    brokerMetrics[customer.brokerCode].khachHang += 1;
    brokerMetrics[customer.brokerCode].duNoMargin += customer.nav > 2000000000 ? Math.floor(customer.nav / 100000000) : Math.floor(customer.nav / 200000000);
  });

  // Aggregate transactions by broker
  mockTransactions.forEach(transaction => {
    const customer = mockCustomers.find(c => c.id === transaction.customerId);
    if (customer && brokerMetrics[customer.brokerCode]) {
      brokerMetrics[customer.brokerCode].hoaHong += transaction.commission / 1000000000;
      brokerMetrics[customer.brokerCode].soLenh += 1;
    }
  });

  // Set plan targets for each broker based on actual performance
  const brokerArray = Object.values(brokerMetrics);
  brokerArray.forEach(broker => {
    // Plan targets are 110-150% of actual to simulate realistic targets
    broker.hoaHongKH = broker.hoaHong * (1.1 + Math.random() * 0.4);
    broker.soLenhKH = Math.round(broker.soLenh * (1.1 + Math.random() * 0.4));
    broker.khachHangKH = Math.round(broker.khachHang * (1.2 + Math.random() * 0.3));
    broker.duNoMarginKH = Math.round(broker.duNoMargin * (1.1 + Math.random() * 0.3));
  });

  // Return sorted by hoaHong (descending)
  return brokerArray.sort((a, b) => b.hoaHong - a.hoaHong);
}

export const mockBrokerChartData = calculateBrokerChartData();

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
