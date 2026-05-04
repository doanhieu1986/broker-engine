# Dashboard Specifications - Broker VPS Management System

Tài liệu chi tiết mô tả Dashboard và toàn bộ tính năng đã triển khai. Sử dụng tài liệu này để yêu cầu xây dựng lại dashboard với các yêu cầu tương tự.

---

## 📋 Tổng Quan Hệ Thống

**Mục đích**: Dashboard giới thiệu cho Broker VPS - công ty cổ phần chứng khoán VPS, cung cấp tổng quan chỉ số kinh doanh, hiệu suất theo khách hàng/broker, và chi tiết quản lý khách hàng.

**Người dùng**: 
- **Manager (Quản lý)**: Nguyễn Quản Lý - quản lý 10 broker (BRK001-BRK010) + khách hàng riêng
- **Broker (Môi giới)**: Nguyễn Minh Tuấn - quản lý khách hàng riêng

---

## 🎯 Trang Dashboard - Chi Tiết Cấu Thành

### 1. Header Section
- **Gradient Background**: Từ accent-600 đến accent-800
- **Tiêu đề**: "Dashboard"
- **Mô tả**: "Tổng quan chỉ số kinh doanh và hiệu suất hàng tháng"

### 2. KPI Type Selector
- **Segmented Control**: 2 tabs - "Công ty" (company) và "Đội nhóm" (team)
- **Mục đích**: Chuyển đổi giữa công ty và đội nhóm
- **Active State**: bg-white dark:bg-slate-900, text-accent-600 dark:text-accent-400

### 3. Score Cards (8 Cards - Grid 4 Cột)

#### 3.1 Tổng Khách Hàng
- **Value**: `totalCustomers` (150 khách hàng)
- **Unit**: "khách hàng"
- **Icon**: `Users` (lucide-react)
- **Trend**: +12%
- **Variant**: primary
- **Plan Completion**: % hoàn thành kế hoạch (random 80-110% cho một số metrics)

#### 3.2 Khách Hàng Hoạt Động
- **Value**: `activeCustomers` (customers with activeStatus = true)
- **Unit**: "khách hàng"
- **Icon**: `TrendingUp`
- **Trend**: +8%
- **Variant**: success

#### 3.3 Phí HHMG (Hoa Hồng)
- **Value**: `totalCommission / 1_000_000_000` (tỷ đồng)
- **Unit**: "tỷ đồng"
- **Icon**: `DollarSign`
- **Trend**: +15%
- **Variant**: warning
- **Plan Completion**: Random 80-110% (không capped nữa, để vary)
- **Giới hạn**: < 1000 tỷ đồng (commission multiplier giảm: 0.01x NAV)

#### 3.4 Giá Trị Giao Dịch
- **Value**: `formatCompactNumber(totalTradingValue / 1_000_000_000)` (format: "77.56K tỷ đồng")
- **Unit**: "tỷ đồng"
- **Icon**: `Zap`
- **Trend**: -5%
- **Variant**: accent
- **Plan Completion**: Random 80-110%
- **Format**: Compact notation (K = thousands)

#### 3.5 Tổng NAV
- **Value**: `totalNAV / 1_000_000_000` (tỷ đồng)
- **Unit**: "tỷ đồng"
- **Icon**: `BarChart2`
- **Trend**: +10%
- **Variant**: primary

#### 3.6 Tổng AUM
- **Value**: `totalAUM / 1_000_000_000` (tỷ đồng)
- **Unit**: "tỷ đồng"
- **Icon**: `Briefcase`
- **Trend**: +12%
- **Variant**: accent

#### 3.7 Số Lượng Nhân Viên
- **Value**: 
  - **Manager**: `user.managedBrokerCodes.length` (10 - số broker quản lý)
  - **Broker**: `mockStaff.filter(s => s.brokerCode === user.brokerCode).length`
- **Unit**: "nhân viên"
- **Icon**: `UserPlus`
- **Trend**: +5%
- **Variant**: success

#### 3.8 Khách Hàng Quản Lý
- **Value**: `mockCustomers.filter(c => c.brokerCode === user.brokerCode).length`
- **Unit**: "khách hàng"
- **Icon**: `UserCheck`
- **Trend**: +8%
- **Variant**: warning

### 4. Charts Section (3 Charts - Grid 3 Cột)

#### 4.1 Doanh Thu & Số Lệnh Giao Dịch (Line Chart)
- **Loại**: Line Chart với 2 lines
- **Data**: `monthlyData` (12 tháng từ T7/24 đến T6/25)
- **Lines**:
  - Line 1: `revenue` (màu gray-900) - Doanh thu (tỷ đ)
  - Line 2: `orders` (màu slate-400) - Số lệnh
- **Special Feature**: 
  - Peak month indicator (đỉnh doanh thu được highlight với circle lớn hơn)
  - Reference line tại peak month
- **Gridline**: 
  - strokeDasharray: "5 5" (dashed)
  - strokeWidth: 1.5 (dày)
  - XAxis interval: 1 (bỏ qua mỗi tháng thứ 2)
- **Height**: 300px

#### 4.2 Số Lượng Khách Hàng Active & Churn Rate (Dual Y-Axis Line Chart)
- **Loại**: Line Chart với dual Y-axes
- **Data**: `monthlyData`
- **Left Y-Axis**: 
  - Line: `customers` (màu slate-300) - Số khách hàng
  - Scale: 0-300+
- **Right Y-Axis**:
  - Line: `churnRate` (màu red-500) - Churn Rate (%)
  - Scale: 0-8%
- **Gridline**: Giống chart 1 (dashed, strokeWidth 1.5)
- **Height**: 300px

#### 4.3 Cơ Cấu Khách Hàng (Donut Chart)
- **Loại**: Pie Chart với innerRadius
- **Data**: `classificationData`
  - VIP: 68
  - Mass: 42
  - Dormant: 25
  - Newbie: 15
- **Visual**: 
  - outerRadius: 100
  - innerRadius: 60 (tạo donut shape)
  - Labels: "VIP 30%", "Mass 18%", etc.
- **Colors**: Sử dụng COLORS array [HIGHLIGHT, BASE, MUTED, LIGHT]
- **Height**: 300px

### 5. Performance Tabs Section

#### 5.1 Tab Navigation
- **2 Tabs**: 
  1. "Hiệu suất theo khách hàng (Top 10)" - Hiển thị cho cả Manager và Broker
  2. "Hiệu suất theo Broker (Top 10)" - Hiển thị chỉ cho Manager
- **Style**: Border-bottom indicator, active = accent-600

#### 5.2 Hiệu Suất Theo Khách Hàng Tab
- **Filtering**: 
  - Manager: tất cả khách hàng
  - Broker: chỉ khách hàng của broker đó (`c.brokerName === user.name`)
- **Data Calculated**:
  - hoaHong: tổng commission / 1B
  - soLenh: số transactions
  - nav: khách hàng NAV / 1B
  - aum: khách hàng AUM / 1B
- **Top 10 Sorting**: 
  - Revenue (hoaHong)
  - Orders (soLenh)
  - NAV
  - AUM
- **Layouts**: 
  - Row 1: 2 charts (Revenue & Orders) side-by-side
  - Row 2: 2 charts (NAV & AUM) side-by-side
- **Chart Type**: Bar Chart (vertical)

#### 5.3 Hiệu Suất Theo Broker Tab (Manager Only)
- **Data Calculated Dynamically**:
  - hoaHong: tổng commission từ khách hàng của broker / 1B
  - soLenh: tổng number of orders từ khách hàng của broker
  - khachHang: số lượng khách hàng của broker
  - duNoMargin: margin debt ước tính từ NAV
- **Layout**:
  - Row 1: 2 charts (Revenue & Orders) side-by-side
  - Row 2: 2 charts (New Customers & Margin Debt) side-by-side
- **Interactivity**: Click bar → Navigate to `/brokers/{brokerCode}`
- **Chart Type**: Bar Chart (vertical)

---

## 📊 Mock Data Structure

### Customer Model
```typescript
{
  id: string (UUID)
  name: string
  email: string
  phone: string
  gender: 'Nam' | 'Nữ'
  dob: string (YYYY-MM-DD)
  idCard: string
  region: string
  brokerCode: string (BRK001-BRK010)
  brokerName: string
  classification: 'VIP' | 'Mass' | 'Dormant' | 'Newbie'
  
  // Tài chính
  nav: number (10B-50B for top 10, 3B-8B for 11-30, 100M-1B for rest)
  aum: number (1.5x-3x NAV)
  totalBalance: number
  profit: number
  totalTrades: number
  activeStatus: boolean (70% true)
  
  // Other fields...
}
```

### Transaction Model
```typescript
{
  id: string
  customerId: string
  date: string
  symbol: string
  type: 'Mua' | 'Bán'
  quantity: number
  price: number
  amount: number
  commission: number (adjusted by NAV tier)
}
```

### Data Generation Rules
- **150 khách hàng** được phân tầng theo NAV:
  - Top 10: 50B → 41B NAV (1 billion mỗi rank)
  - Rank 11-30: 3B-8B NAV random
  - Rank 31+: 100M-1B NAV random
  
- **Transactions per customer** tỷ lệ với NAV:
  - Top tier (50B): ~20,000 giao dịch
  - High tier (10-50B): ~3,000-15,000 giao dịch
  - Mid tier (1-10B): ~200-600 giao dịch
  - Regular (<1B): ~5-15 giao dịch
  
- **Commission multiplier**: 1 + (NAV_in_billions × 0.01)
  - Top customer (50B): 1.5x multiplier
  - Regular customer: 1x

- **Staff per broker**: 5-10 nhân viên
  - Chức danh: 'Giám đốc TVĐT', 'Trưởng phòng TVĐT', 'Chuyên viên tư vấn', etc.

---

## 🎨 Color Scheme & Styling

### Chart Colors
```javascript
CHART_BASE = '#9ca3af' (gray)
CHART_MUTED = '#cbd5e1' (light gray)
CHART_LIGHT = '#e5e7eb' (lighter gray)
CHART_HIGHLIGHT = '#7c3aed' (purple)
AXIS_LABEL = '#cbd5e1' (light gray for axis text)
```

### Gridlines
- **strokeDasharray**: "5 5" (5px dash, 5px gap)
- **strokeWidth**: 1.5
- **stroke**: "#e5e7eb"
- **XAxis interval**: 1 (mỗi tháng khác có gridline dọc)

### Card Layout
- **Grid**: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- **Background**: bg-white dark:bg-slate-900
- **Border**: border border-slate-200 dark:border-slate-800
- **Rounded**: rounded-xl
- **Shadow**: shadow-lg

---

## 🔄 User Role Specific Behavior

### Manager (Nguyễn Quản Lý)
- **Broker Code**: BRK000
- **Managed Brokers**: BRK001-BRK010 (10 brokers)
- **Managed Customers**: Khách hàng có brokerCode = BRK000
- **Dashboard**:
  - Số lượng nhân viên = 10 (số broker quản lý)
  - Khách hàng quản lý = khách hàng của BRK000
  - Xem được tab "Hiệu suất theo Broker (Top 10)"
  - Hiệu suất theo khách hàng = toàn bộ 150 khách hàng

### Broker (Nguyễn Minh Tuấn)
- **Broker Code**: BRK001
- **Managed Customers**: Khách hàng có brokerCode = BRK001
- **Dashboard**:
  - Số lượng nhân viên = số staff của BRK001
  - Khách hàng quản lý = khách hàng của BRK001
  - Không thấy tab "Hiệu suất theo Broker (Top 10)"
  - Hiệu suất theo khách hàng = chỉ khách hàng của BRK001

---

## 🔢 Format & Calculations

### Number Formatting

#### Score Card Values
- **Tỷ đồng**: Chia cho 1 billion (1,000,000,000)
  - VD: 12,500,000,000 → 12.50 tỷ đồng
  
- **Compact Format**: Chia cho 1 billion, format với K suffix nếu >= 1000
  - VD: 76,560,000,000 → 76.56K tỷ đồng
  - Công thức: `(value / 1_000_000_000 / 1000).toFixed(2) + 'K'`

### Plan Completion Percentage
- **Range**: 80% - 110% (random)
- **Mục đích**: Cho thấy sự biến thiên trong hiệu suất

### Projected Value
- Công thức: `Math.round(currentValue * (1 + trendPercent / 100))`
- VD: Trend +15% trên 100 = 115 (projected)

---

## 📱 Responsive Design

- **Mobile** (< 768px): 
  - Grid cols = 1
  - Charts: Full width
  
- **Tablet** (768px - 1024px): 
  - Score cards: 2 columns
  - Charts: 1-2 columns
  
- **Desktop** (> 1024px):
  - Score cards: 4 columns
  - Charts: 3 columns

---

## 🔗 Navigation & Routing

- `/` → Dashboard (default)
- `/customers` → Quản lý khách hàng
- `/brokers/{brokerCode}` → Chi tiết broker
- `/brokers/{brokerCode}/customers/{customerId}` → Chi tiết khách hàng

---

## 📦 Dependencies & Libraries

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "recharts": "^2.10.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.344.0",
  "@faker-js/faker": "^8.3.0",
  "typescript": "^5.3.0",
  "vite": "^8.0.0"
}
```

---

## 🚀 Build & Deployment

- **Build Command**: `npm run build`
- **Output**: `/web/dist`
- **Deployment**: Vercel
- **vercel.json** Config:
  - buildCommand: `cd web && npm install && npm run build`
  - outputDirectory: `web/dist`
  - installCommand: `npm install --prefix web`

---

## ✅ Checklist Tính Năng Đã Triển Khai

- ✅ Dashboard với 8 score cards
- ✅ 3 charts (2 line charts, 1 donut chart)
- ✅ Performance tabs (Customer & Broker)
- ✅ User role-based filtering (Manager vs Broker)
- ✅ Mock data với variance (80-110% plan completion)
- ✅ Compact number formatting (K notation)
- ✅ Gridlines styling (dashed, strokeWidth 1.5)
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Dynamic broker data calculation
- ✅ Dual Y-axis for churn rate chart
- ✅ Interactive charts with navigation

---

## 📝 Ghi Chú Quan Trọng

1. **Commission Multiplier**: Giảm xuống 0.01x NAV để giữ Phí HHMG < 1000 tỷ đồng
2. **Plan Completion**: Random 80-110% cho Phí HHMG & Giá trị giao dịch (không fixed)
3. **Staff Count**: Khác nhau giữa Manager (số broker) và Broker (số nhân viên)
4. **Broker Data**: Tính toán động từ customers được giao cho broker đó
5. **Gridlines**: Cả 2 line charts có gridline dashed giống nhau

---

## 📞 Để Yêu Cầu Xây Dựng Lại

Sử dụng tài liệu này cùng với prompt như sau:

```
Hãy xây dựng cho tôi một dashboard với yêu cầu như ở file DASHBOARD_SPECS.md.
Đảm bảo:
- Dashboard có 8 score cards với dữ liệu giống như spec
- 3 charts: 2 line charts + 1 donut chart
- Performance tabs cho customer và broker
- User role-based behavior (Manager vs Broker)
- Mock data với variance trong plan completion
- Formatting và styling giống spec
```

---

**Version**: 1.0  
**Last Updated**: 2026-05-04  
**Status**: Production (Demo)
