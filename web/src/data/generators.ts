import { faker } from '@faker-js/faker';

// Vietnamese names data
const firstNames = [
  'Nguyễn', 'Trần', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ',
  'Dương', 'Lê', 'Võ', 'Mai', 'Tạ', 'Chu', 'Tô', 'Lý', 'Đinh'
];

const lastNames = [
  'An', 'Anh', 'Ân', 'Ánh', 'Bảo', 'Bình', 'Công', 'Cường', 'Dũng', 'Dung',
  'Dương', 'Đạt', 'Đại', 'Đào', 'Đức', 'Hải', 'Hạnh', 'Hào', 'Hậu', 'Hương',
  'Huyền', 'Huỳnh', 'Huy', 'Hỷ', 'Khánh', 'Kiều', 'Kiên', 'Khoa', 'Khôi', 'Kỳ',
  'Linh', 'Loan', 'Long', 'Lực', 'Lương', 'Lưu', 'Lý', 'Minh', 'Mỹ',
  'Nam', 'Nghi', 'Nghĩa', 'Nghiêm', 'Nghiên', 'Ngôn', 'Ngộ', 'Ngũ', 'Nhi', 'Nhân',
  'Nhiều', 'Nhung', 'Nh', 'Nhuận', 'Nhữ', 'Nhuỵ', 'Nội', 'Oanh',
  'Phi', 'Phú', 'Phúc', 'Phương', 'Phượng', 'Quân', 'Quang', 'Quế', 'Quỳ', 'Quyền',
  'Rồng', 'Sang', 'Sanh', 'Sâu', 'Siêu', 'Sơn', 'Sơn', 'Sữa', 'Tài', 'Tâm', 'Tế', 'Thái', 'Thắm', 'Thắng', 'Thạch',
  'Thiết', 'Thiệu', 'Thịnh', 'Thoa', 'Thoại', 'Thủy', 'Thừa', 'Thương', 'Thuyền', 'Thuyết',
  'Tiến', 'Tiểu', 'Tiến', 'Tiết', 'Tiệm', 'Tiếu', 'Tính', 'Tịnh',
  'Trang', 'Trân', 'Trâm', 'Trân', 'Trương', 'Trẻ', 'Trí',
  'Triều', 'Triệu', 'Trính', 'Trọng', 'Trung', 'Trúc', 'Trực', 'Trực',
  'Trường', 'Tuân', 'Tuấn', 'Tú', 'Túc', 'Tuệ',
  'Tuy', 'Tuyền', 'Tuyết', 'Tuyền', 'Tuyến', 'Tuyên', 'Tư', 'Tưởng', 'Tương', 'Uyên'
];

function getVietnameseName(): string {
  const firstName = faker.helpers.arrayElement(firstNames);
  const lastName = faker.helpers.arrayElement(lastNames);
  const middleName = faker.helpers.arrayElement(lastNames);
  return `${firstName} ${middleName} ${lastName}`;
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
}

function generateVietnameseEmail(name: string): string {
  const nameParts = name.split(' ').filter(p => p.length > 0);
  const emailName = nameParts.join('_');
  const domains = ['example.com', 'vps.com', 'broker.vn', 'mail.vn'];
  const domain = faker.helpers.arrayElement(domains);
  return `${removeAccents(emailName)}${faker.number.int({ min: 100, max: 999 })}@${domain}`;
}

function generateAccountNumber(): string {
  const letter = faker.string.alpha({ length: 1, casing: 'upper' });
  const fiveDigits = faker.string.numeric(5);
  const lastDigit = faker.helpers.arrayElement(['1', '3', '6', '8']);
  return `${letter}${fiveDigits}${lastDigit}`;
}

export type IndustrySector = {
  name: string;
  value: number;
};

export type StockType = {
  name: string;
  value: number;
};

export type PolicyFee = {
  feeSchedule: string;
  policies: string[];
  financialServices: string[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  idCard: string;
  idCardIssuedDate: string;
  idCardIssuedPlace: string;
  occupation: string;
  hobbies: string[];
  region: string;
  accountNumber: string;
  accountOpenDate: string;
  nav: number;
  classification: 'VIP' | 'Mass' | 'Dormant' | 'Newbie';
  totalBalance: number;
  profit: number;
  totalTrades: number;
  activeStatus: boolean;
  brokerName: string;
  brokerCode: string;
  commissionRate: number;
  navGroup: string;
  aum: number;
  investedValue: number;
  industrySectors: IndustrySector[];
  stockTypes: StockType[];
  policyFee: PolicyFee;
  riskAppetite: 'Cao' | 'Thấp' | 'Cân bằng';
  preferredProducts: string[];
  interestedIndustries: string[];
  marginStatus: 'Monitoring' | 'Warning' | 'Call Margin' | 'Force Sell';
  marginRatio: number;
  daysUntilBirthday: number;
  nextBestActions: NextBestAction[];
};

export type Transaction = {
  id: string;
  customerId: string;
  date: string;
  symbol: string;
  type: 'Mua' | 'Bán';
  quantity: number;
  price: number;
  amount: number;
  commission: number;
};

export type KPI = {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: 'team' | 'company';
  trend: number;
};

export type PerformanceReport = {
  id: string;
  brokerName: string;
  brokerId: string;
  period: string;
  newAccountsOpened: number;
  totalCommission: number;
  totalTradingValue: number;
  totalOrders: number;
  activeAccountsRatio: number;
  staffCount: number;
  tradingVolume: number;
  tradingFrequency: number;
};

export type StaffPotential = {
  id: string;
  staffName: string;
  currentLevel: string;
  achievement: number;
  daysInCompany: number;
  commission: number;
  recommendation: string;
};

export type Staff = {
  id: string;
  brokerCode: string;
  name: string;
  email: string;
  salesType: 'Công tác viên' | 'Nhân viên chính thức cấp 1' | 'Nhân viên chính thức cấp 2';
  position: string;
  onboardDate: string;
  latestOfficialDate: string;
  navTransferredOut: number;
  navTransferredIn: number;
  customersTransferredIn: number;
  customersTransferredOut: number;
  directManager: string;
};

export type BirthdayReport = {
  id: string;
  customerId: string;
  customerName: string;
  dob: string;
  daysUntilBirthday: number;
  classification: string;
  brokerName: string;
  phone: string;
  customerCareScenario: string;
  status: string;
  stt?: number;
};

export type MarginReport = {
  id: string;
  // Group A: Customer & Manager Info
  customerName: string;
  accountNumber: string;
  brokerName: string;
  branch: string;

  // Group B: Margin Ratios Status
  currentMarginRatio: number;
  maintenanceRatio: number;
  forceSellRatio: number;
  status: 'Warning' | 'Call Margin' | 'Force Sell' | 'Monitoring';

  // Group C: Financial Metrics
  totalAssetValue: number;
  totalDebt: number;
  equity: number;
  callAmount: number;
  sellAmountToCover: number;

  // Group D: Timeline
  callDate: string;
  dueDate: string;
  expectedForceSellDate: string;
};

export type NextBestAction = {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
};

const regions = ['Hà Nội', 'Thành phố Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Hải Dương', 'Hưng Yên', 'Quảng Ninh'];
const classifications: Array<'VIP' | 'Mass' | 'Dormant' | 'Newbie'> = ['VIP', 'Mass', 'Dormant', 'Newbie'];
const stocks = ['VNM', 'HPG', 'FPT', 'BID', 'ACB', 'MBB', 'CTG', 'VIC', 'MSN', 'VJC'];
const brokerMapping = [
  { code: 'BRK001', name: 'Nguyễn Minh Tuấn' },
  { code: 'BRK002', name: 'Trần Thị Hoa' },
  { code: 'BRK003', name: 'Phạm Văn Đức' },
  { code: 'BRK004', name: 'Lê Quang Minh' },
  { code: 'BRK005', name: 'Võ Thị Mai' },
  { code: 'BRK006', name: 'Hoàng Văn Long' },
  { code: 'BRK007', name: 'Đặng Thị Linh' },
  { code: 'BRK008', name: 'Bùi Minh Khoa' },
  { code: 'BRK009', name: 'Hồ Thị Thanh' },
  { code: 'BRK010', name: 'Dương Văn Hải' },
];
const feeSchedules = ['V13 - Gói phí 0.15%', 'V12 - Gói phí 0.20%', 'V11 - Gói phí 0.25%', 'V10 - Gói phí 0.30%'];
const policiesList = ['V+ đặc biệt', 'Lãi suất VIP', 'K+', 'Ưu đãi margin'];
const financialServices = [
  'Lãi vay siêu hời',
  'Đầu tư bứt phá',
  'Ưu đãi lãi suất margin T5',
  'Giao dịch tài chính - Lãi suất 13.5%'
];
const occupations = ['Kỹ sư', 'Quản lý', 'Bác sĩ', 'Luật sư', 'Giáo viên', 'Kinh doanh', 'Nhân viên IT', 'Thiết kế', 'Tài chính', 'Bán hàng'];
const hobbiesList = ['Du lịch', 'Hiking', 'Đọc sách', 'Chơi thể thao', 'Nhiếp ảnh', 'Nấu ăn', 'Chơi âm nhạc', 'Yoga'];
const idCardIssuedPlaces = ['Công an Hà Nội', 'Công an TP.HCM', 'Công an Đà Nẵng', 'Công an Hải Phòng', 'Công an Cần Thơ'];

function generateNextBestActions(customer: Partial<Customer> & {
  classification: 'VIP' | 'Mass' | 'Dormant' | 'Newbie';
  nav: number;
  aum: number;
  profit: number;
  totalTrades: number;
  riskAppetite: 'Cao' | 'Thấp' | 'Cân bằng';
  preferredProducts: string[];
  activeStatus: boolean;
  marginStatus: 'Monitoring' | 'Warning' | 'Call Margin' | 'Force Sell';
  marginRatio: number;
  daysUntilBirthday: number;
}): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // Action 1: Force Sell Alert
  if (customer.marginStatus === 'Force Sell') {
    actions.push({
      id: faker.string.uuid(),
      title: 'Cảnh báo: Liên hệ khách hàng bị Force Sell',
      description: 'Tài khoản khách hàng ở trạng thái Force Sell, sắp có lệnh bán cưỡng chế',
      priority: 'high',
      icon: '🚨',
    });
  }

  // Action 2: Call Margin Alert
  if (customer.marginStatus === 'Call Margin') {
    actions.push({
      id: faker.string.uuid(),
      title: 'Liên hệ khách hàng bị Call Margin',
      description: 'Tài khoản ở trạng thái Call Margin, cần liên hệ khách hàng để bổ sung margin ngay',
      priority: 'high',
      icon: '📢',
    });
  }

  // Action 3: Birthday Coming Up
  if (customer.daysUntilBirthday > 0 && customer.daysUntilBirthday <= 7) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Chúc mừng sinh nhật khách hàng',
      description: `Khách hàng có sinh nhật trong vòng ${customer.daysUntilBirthday} ngày, có thể gửi lời chúc và ưu đãi đặc biệt`,
      priority: 'medium',
      icon: '🎂',
    });
  }

  // Action 4: Upgrade classification if NAV is high
  if (customer.classification === 'Mass' && customer.nav > 500000000) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Nâng cấp tài khoản lên VIP',
      description: 'Khách hàng có NAV cao, đủ điều kiện nâng cấp để nhận các ưu đãi VIP',
      priority: 'high',
      icon: '⭐',
    });
  }

  // Action 5: Expand to derivatives if not already using
  if (!customer.preferredProducts.includes('Phái sinh') && customer.riskAppetite !== 'Thấp') {
    actions.push({
      id: faker.string.uuid(),
      title: 'Tìm hiểu sản phẩm Phái sinh',
      description: 'Mở rộng danh mục đầu tư sang sản phẩm phái sinh phù hợp với khẩu vị rủi ro',
      priority: 'medium',
      icon: '📈',
    });
  }

  // Action 6: Boost inactive accounts
  if (!customer.activeStatus) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Liên hệ khích hoạt tài khoản',
      description: 'Khách hàng không còn hoạt động, cần liên hệ để tìm hiểu nhu cầu và khích hoạt',
      priority: 'high',
      icon: '📞',
    });
  }

  // Action 7: High profit recommendation
  if (customer.profit > 100000000) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Tư vấn gọi vốn',
      description: 'Khách hàng có lợi nhuận cao, có thể tư vấn về các sản phẩm tăng thêm vốn',
      priority: 'medium',
      icon: '💰',
    });
  }

  // Action 8: Low trading activity
  if (customer.totalTrades < 50) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Tư vấn kế hoạch giao dịch',
      description: 'Tần suất giao dịch thấp, cần liên hệ tư vấn và phát triển kế hoạch đầu tư',
      priority: 'medium',
      icon: '📊',
    });
  }

  // Action 9: Newbie customer care
  if (customer.classification === 'Newbie') {
    actions.push({
      id: faker.string.uuid(),
      title: 'Hỗ trợ giáo dục tài chính',
      description: 'Khách hàng mới, cần tư vấn chi tiết về nền tảng giao dịch và các sản phẩm',
      priority: 'high',
      icon: '🎓',
    });
  }

  // Action 10: Expand to bonds if not using
  if (!customer.preferredProducts.includes('Trái phiếu')) {
    actions.push({
      id: faker.string.uuid(),
      title: 'Giới thiệu sản phẩm trái phiếu',
      description: 'Đa dạng hóa danh mục bằng các sản phẩm trái phiếu ổn định',
      priority: 'low',
      icon: '📜',
    });
  }

  return actions.slice(0, 4);
}

export function generateCustomer(): Customer {
  const id = faker.string.uuid();
  const gender = faker.datatype.boolean() ? 'Nam' : 'Nữ';
  const vietnameseName = getVietnameseName();

  const nav = faker.number.int({ min: 100000000, max: 5000000000 });
  const aum = faker.number.int({ min: Math.floor(nav * 1.5), max: Math.floor(nav * 3) });
  const investedRatio = faker.number.float({ min: 0.3, max: 0.7, fractionDigits: 2 });
  const investedValue = Math.floor(aum * investedRatio);

  const industries = ['Bất động sản', 'Ngân hàng', 'Công nghệ', 'Hóa chất', 'Bán lẻ'];
  const industrySectors = industries.map(industry => ({
    name: industry,
    value: faker.number.int({ min: 5, max: 30 }),
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  const stocks = ['Bluechip', 'Midcap', 'Penny'];
  const stockTypes = stocks.map(type => ({
    name: type,
    value: faker.number.int({ min: 20, max: 40 }),
  }));

  const selectedPolicies = faker.helpers.arrayElements(policiesList, { min: 2, max: 3 });
  const selectedServices = faker.helpers.arrayElements(financialServices, { min: 2, max: 3 });

  const allProducts = ['Chứng khoán', 'Trái phiếu', 'Quỹ mở', 'Phái sinh', 'Huy động vốn'];
  const preferredProducts = faker.helpers.arrayElements(allProducts, { min: 2, max: 3 });

  const allIndustries = ['TMĐT', 'Bất động sản', 'Công nghệ', 'Ngân hàng', 'Năng lượng'];
  const interestedIndustries = faker.helpers.arrayElements(allIndustries, { min: 2, max: 3 });

  const classification = faker.helpers.arrayElement(classifications);
  const riskAppetite = faker.helpers.arrayElement(['Cao', 'Thấp', 'Cân bằng'] as const);
  const profit = faker.number.int({ min: -5000000, max: 10000000 });
  const totalTrades = faker.number.int({ min: 0, max: 5000 });
  const activeStatus = faker.datatype.boolean(0.7);

  // Calculate DOB and birthday info
  const dob = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0];
  const dobDate = new Date(dob);
  const today = new Date();
  let nextBirthday = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, dobDate.getMonth(), dobDate.getDate());
  }
  const daysUntilBirthday = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate margin ratio and status
  const marginRatio = (profit / nav) * 100;
  const marginStatusRandom = faker.number.int({ min: 0, max: 100 });
  let marginStatus: 'Monitoring' | 'Warning' | 'Call Margin' | 'Force Sell' = 'Monitoring';
  if (marginStatusRandom > 90) marginStatus = 'Force Sell';
  else if (marginStatusRandom > 75) marginStatus = 'Call Margin';
  else if (marginStatusRandom > 50) marginStatus = 'Warning';

  const partialCustomer = {
    classification,
    nav,
    aum,
    profit,
    totalTrades,
    riskAppetite,
    preferredProducts,
    activeStatus,
    marginStatus,
    marginRatio,
    daysUntilBirthday,
  };

  return {
    id,
    name: vietnameseName,
    email: generateVietnameseEmail(vietnameseName),
    phone: '0' + faker.string.numeric(9),
    gender: gender as 'Nam' | 'Nữ',
    dob,
    idCard: faker.string.numeric(12),
    idCardIssuedDate: faker.date.past({ years: 10 }).toISOString().split('T')[0],
    idCardIssuedPlace: faker.helpers.arrayElement(idCardIssuedPlaces),
    occupation: faker.helpers.arrayElement(occupations),
    hobbies: faker.helpers.arrayElements(hobbiesList, { min: 1, max: 3 }),
    region: faker.helpers.arrayElement(regions),
    accountNumber: generateAccountNumber(),
    accountOpenDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    nav,
    classification,
    totalBalance: faker.number.int({ min: 50000, max: 20000000 }),
    profit,
    totalTrades,
    activeStatus,
    ...(() => {
      const broker = faker.helpers.arrayElement(brokerMapping);
      return { brokerName: broker.name, brokerCode: broker.code };
    })(),
    commissionRate: faker.number.float({ min: 0.1, max: 0.5, fractionDigits: 2 }),
    navGroup: nav > 2000000000 ? 'Nhóm A (>2B)' : nav > 500000000 ? 'Nhóm B (500M-2B)' : 'Nhóm C (100-500M)',
    aum,
    investedValue,
    industrySectors,
    stockTypes,
    policyFee: {
      feeSchedule: faker.helpers.arrayElement(feeSchedules),
      policies: selectedPolicies,
      financialServices: selectedServices,
    },
    riskAppetite,
    preferredProducts,
    interestedIndustries,
    marginStatus,
    marginRatio,
    daysUntilBirthday,
    nextBestActions: generateNextBestActions(partialCustomer),
  };
}

export function generateTransaction(customerId: string): Transaction {
  return {
    id: faker.string.uuid(),
    customerId,
    date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    symbol: faker.helpers.arrayElement(stocks),
    type: faker.datatype.boolean() ? 'Mua' : 'Bán',
    quantity: faker.number.int({ min: 100, max: 10000 }),
    price: faker.number.int({ min: 10000, max: 500000 }),
    amount: faker.number.int({ min: 1000000, max: 500000000 }),
    commission: faker.number.int({ min: 10000, max: 5000000 }),
  };
}

export function generateKPI(): KPI {
  const names = [
    'Tổng số tài khoản mở mới',
    'Doanh số phí/hoa hồng',
    'Giá trị giao dịch',
    'Số lệnh giao dịch',
    'Số tài khoản active',
    'Số lượng nhân viên',
    'Doanh số giao dịch',
    'Tần suất giao dịch',
  ];

  const units = ['', 'tỷ đồng', 'tỷ đồng', 'lệnh', '%', 'người', 'tỷ đồng', 'giao dịch/ngày'];

  const index = faker.number.int({ min: 0, max: names.length - 1 });

  return {
    id: faker.string.uuid(),
    name: names[index],
    value: faker.number.int({ min: 50, max: 10000 }),
    target: faker.number.int({ min: 100, max: 15000 }),
    unit: units[index],
    category: faker.datatype.boolean() ? 'team' : 'company',
    trend: faker.number.int({ min: -20, max: 50 }),
  };
}

export function generatePerformanceReport(): PerformanceReport {
  return {
    id: faker.string.uuid(),
    brokerName: getVietnameseName(),
    brokerId: faker.string.uuid(),
    period: `Tháng ${faker.number.int({ min: 1, max: 12 })}/2024`,
    newAccountsOpened: faker.number.int({ min: 5, max: 50 }),
    totalCommission: faker.number.int({ min: 100000000, max: 5000000000 }),
    totalTradingValue: faker.number.int({ min: 500000000, max: 50000000000 }),
    totalOrders: faker.number.int({ min: 100, max: 5000 }),
    activeAccountsRatio: faker.number.int({ min: 30, max: 95 }),
    staffCount: faker.number.int({ min: 1, max: 20 }),
    tradingVolume: faker.number.int({ min: 1000000, max: 100000000 }),
    tradingFrequency: Math.round(faker.number.float({ min: 0.5, max: 5 }) * 10) / 10,
  };
}

export function generateStaff(brokerCode: string, brokerName: string): Staff {
  const salesTypes: Array<'Công tác viên' | 'Nhân viên chính thức cấp 1' | 'Nhân viên chính thức cấp 2'> = [
    'Công tác viên',
    'Nhân viên chính thức cấp 1',
    'Nhân viên chính thức cấp 2',
  ];
  const positions = [
    'Nhân viên bán hàng',
    'Trưởng phòng kinh doanh',
    'Quản lý khối bán hàng',
    'Chuyên viên tư vấn',
    'Giám đốc chi nhánh',
    'Trưởng nhóm kinh doanh',
  ];

  return {
    id: faker.string.uuid(),
    brokerCode,
    name: brokerName,
    email: `${removeAccents(brokerName.replace(/\s+/g, '_'))}@vps.vn`,
    salesType: faker.helpers.arrayElement(salesTypes),
    position: faker.helpers.arrayElement(positions),
    onboardDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    latestOfficialDate: faker.date.past({ years: 2 }).toISOString().split('T')[0],
    navTransferredOut: faker.number.int({ min: 100000000, max: 5000000000 }),
    navTransferredIn: faker.number.int({ min: 100000000, max: 5000000000 }),
    customersTransferredIn: faker.number.int({ min: 5, max: 50 }),
    customersTransferredOut: faker.number.int({ min: 5, max: 50 }),
    directManager: getVietnameseName(),
  };
}

export function generateMockStaff(): Staff[] {
  return brokerMapping.map(broker => generateStaff(broker.code, broker.name));
}
