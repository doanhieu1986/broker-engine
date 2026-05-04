# Hướng dẫn Demo - Broker VPS Management System

## 🎉 Bắt đầu

### Khởi động ứng dụng
```bash
cd /Users/hieudt/broker-engine/web
npm run dev
```

Truy cập: **http://localhost:5173/**

---

## 📱 Các trang trong demo

### 1️⃣ **Dashboard** (`/`)
Trang chính hiển thị tổng quan kinh doanh

**Các thành phần:**
- **KPI Cards**: 4 chỉ số chính
  - Tổng khách hàng: 150 khách hàng
  - Khách hàng hoạt động: ~120 khách hàng
  - Tổng hoa hồng: ~100 tỷ đồng
  - Giá trị giao dịch: ~50 tỷ đồng

- **Biểu đồ 1**: Doanh thu & Số lệnh (LineChart)
  - Xu hướng theo tháng
  - 2 trục Y (doanh thu + số lệnh)

- **Biểu đồ 2**: Phân loại khách hàng (PieChart)
  - VIP / Mass / Dormant / Newbie
  - Màu sắc phân biệt

- **Biểu đồ 3**: So sánh khách hàng theo tháng (BarChart)

---

### 2️⃣ **Quản lý Khách Hàng** (`/customers`)
Danh sách đầy đủ thông tin khách hàng

**Các tính năng:**
- ✅ **Bộ lọc**:
  - Lọc theo Khu vực (Hà Nội, HCM, Đà Nẵng, ...)
  - Lọc theo Phân loại (VIP, Mass, Dormant, Newbie)
  - Lọc theo Trạng thái (Hoạt động / Không hoạt động)

- ✅ **Bảng dữ liệu**:
  - Tên khách hàng
  - Email, Điện thoại
  - Phân loại (với badge màu)
  - NAV (tỷ đ) - có thể sort
  - Khu vực
  - Trạng thái (✓ hoạt động / ✗ không hoạt động)

- ✅ **Tìm kiếm**: Nhập tên, email, hoặc SĐT

- ✅ **Modal Chi tiết**: Click vào hàng để xem
  - **Thông tin cá nhân**: Tên, Email, ĐT, Giới tính
  - **Thông tin tài khoản**: Số TK, Ngày mở, NAV, Số dư, Lợi nhuận, Phân loại
  - **Thông tin giao dịch**: Tổng số lệnh, Trạng thái

---

### 3️⃣ **Báo cáo** (`/reports`)
3 loại báo cáo trong tab

#### Tab 1: **Hiệu suất bán hàng**
- Bảng chi tiết metrics từng broker
- Columns: Tên, Kỳ, Tài khoản mới, Hoa hồng, Số lệnh, Tài khoản active %, Giá trị giao dịch
- Sortable, searchable

#### Tab 2: **Hỗ trợ khách hàng**
- **Thống kê summary**:
  - Tổng case
  - Case mở (đỏ)
  - Đang xử lý (vàng)
  - Đã giải quyết (xanh)

- **Bảng case**:
  - ID
  - Loại (Khiếu nại / Hỗ trợ / Tư vấn)
  - Trạng thái (Mở / Đang xử lý / Đã giải quyết)
  - Cảm xúc (Tích cực / Trung lập / Tiêu cực)
  - Ngày tạo

#### Tab 3: **Tin tức thị trường**
- Tin tức từ các sàn (VSD, HNX, HOSE)
- Columns: Tiêu đề, Nguồn, Danh mục, Ngày

---

### 4️⃣ **Phân tích Hiệu suất** (`/performance`)
Deep dive vào metrics hiệu suất

**Các biểu đồ:**
1. **Hiệu suất theo kỳ** (LineChart)
   - Hoa hồng (trục Y trái)
   - Số lệnh (trục Y phải)
   - 6 tháng gần nhất

2. **Mối quan hệ: Số lệnh vs Hoa hồng** (ScatterChart)
   - Mỗi điểm = 1 broker
   - Thể hiện correlation

3. **Top 10 Broker** (BarChart)
   - Sắp xếp theo tổng hoa hồng
   - Tên broker trục X, hoa hồng trục Y

4. **Bảng chi tiết** (DataTable)
   - Metrics từng broker
   - Sortable, searchable

---

### 5️⃣ **Phân tích Dữ liệu** (`/analytics`)
Khám phá xu hướng và mô hình

**Thống kê:**
- Khách hàng VIP: ~40 người
- Khách hàng Mass: ~60 người
- NAV trung bình: ~1.5 tỷ đ
- Lợi nhuận trung bình: ~500 triệu đ

**Bộ chọn kỳ:**
- [ Theo tuần ] [ Theo tháng ]
- Các biểu đồ thay đổi dựa trên lựa chọn

**Các biểu đồ:**
1. **Xu hướng hiệu suất** (AreaChart)
   - Doanh thu theo thời gian
   - Động khi thay đổi period

2. **Phát triển khách hàng** (LineChart)
   - Số khách hàng qua các tháng

3. **Phân bố NAV** (BarChart)
   - Dưới 100M / 100-500M / 500M-1B / Trên 1B

4. **Churn Rate** (LineChart)
   - Tỷ lệ khách hàng không hoạt động
   - Theo tháng

---

## 🎨 UI Features

### Dark Mode Toggle
- Button ở header phía phải
- Tự động apply dark theme cho toàn app

### Responsive Design
- **Desktop**: Full layout với sidebar
- **Tablet**: Sidebar collapse-able
- **Mobile**: Hamburger menu (≤1024px)

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Purple**: (#a855f7) cho VIP

---

## 📊 Mock Data Chi tiết

### Khách hàng
- **150 customers** sinh ngẫu nhiên
- Phân bố đều: VIP (~40), Mass (~60), Dormant (~30), Newbie (~20)
- Locations: Hà Nội, HCM, Đà Nẵng, Hải Phòng, ...
- NAV: từ 100K đến 50M
- Trạng thái: ~80% hoạt động, ~20% không hoạt động

### Giao dịch
- **~5000 transactions** cho 150 customers
- Stocks: VNM, HPG, FPT, BID, ACB, MBB, CTG, VIC, MSN, VJC
- Loại: Mua (50%) / Bán (50%)
- Giá: 10K - 500K per share
- Số lượng: 100 - 10K shares

### Performance Reports
- **50 reports** cho các broker khác nhau
- Kỳ: Tháng 1-6/2024
- Metrics: Tài khoản mới, Hoa hồng, Giá trị giao dịch, Số lệnh, ...

---

## 🔑 Keyboard Shortcuts

- `Alt + M`: Menu toggle (mobile)
- `Alt + D`: Dark mode toggle

---

## 📝 Feedback Collection

**Từ demo này, cần thu thập feedback về:**

1. ✅ Layout & Navigation
   - Có phải user-friendly không?
   - Sidebar positioning OK?

2. ✅ Báo cáo & Metrics
   - Thiếu KPI nào?
   - Thêm dimension nào?

3. ✅ Filtering & Search
   - Cần thêm filter nào?
   - Advanced filter?

4. ✅ Export Features
   - Cần export PDF/Excel không?
   - Format nào?

5. ✅ Workflow & Features
   - Tính năng nào thêm?
   - Tính năng nào bỏ?

6. ✅ Performance & Speed
   - Load time có OK?
   - Chart rendering smooth?

---

## 🚀 Phát triển tiếp theo

Khi hoàn thành feedback:

1. **API Integration**
   - Kết nối đến backend (VSD, HNX, HOSE)
   - Real-time data updates

2. **Database Schema**
   - Design lại model cho production
   - Migration strategy

3. **Authentication**
   - User roles: Admin, Manager, Broker
   - Permission management

4. **Performance Optimization**
   - Lazy loading cho reports
   - Data virtualization cho large tables
   - Caching strategy

5. **Advanced Features**
   - Custom date ranges
   - Drill-down capabilities
   - Custom report builder
   - Scheduled reports
   - Data export scheduling

---

## 📧 Notes

- Project sử dụng **mock data** - không cần database
- Build sẵn cho production tại `dist/` folder
- Tailwind CSS configured cho dark mode
- Responsive design ready cho mobile

**Happy demo! 🎉**
