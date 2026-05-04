# Broker VPS Management System - Demo UI

Demo mockup UI cho hệ thống quản lý Broker VPS của công ty chứng khoán.

## 📋 Tổng quan

Hệ thống demo cung cấp giao diện quản lý cho các hoạt động kinh doanh của Broker VPS, bao gồm:

- **Dashboard**: Tổng quan chỉ số KPI chính
- **Quản lý khách hàng**: Danh sách và chi tiết khách hàng
- **Báo cáo**: Hiệu suất bán hàng, hỗ trợ khách hàng, tin tức thị trường
- **Phân tích hiệu suất**: Metrics chi tiết, drill-down capabilities
- **Phân tích dữ liệu**: Xu hướng, phân bố, churn rate

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + custom CSS
- **Charts**: Recharts
- **UI Icons**: lucide-react
- **Routing**: React Router
- **Mock Data**: @faker-js/faker
- **Export**: jsPDF + xlsx (ready for integration)

## 📁 Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, Layout wrapper
│   │   ├── dashboard/       # Dashboard components
│   │   ├── reports/         # Report components
│   │   ├── customers/       # Customer management
│   │   ├── shared/          # StatCard, DataTable, etc
│   │   └── charts/          # Chart components
│   ├── pages/               # Page-level components
│   ├── data/                # Mock data & generators
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Router setup
│   └── main.tsx             # Entry point
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## 🚀 Chạy Project

### Cài đặt dependencies
```bash
cd web
npm install
```

### Chạy development server
```bash
npm run dev
```
Truy cập http://localhost:5173/

### Build production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 🎯 Features Demo

### 1. Dashboard
- Hiển thị KPI chính (Khách hàng, Hoa hồng, Giá trị giao dịch)
- Biểu đồ doanh thu, số lệnh theo tháng
- Phân bố phân loại khách hàng (VIP, Mass, Dormant, Newbie)
- Trend metrics theo tháng

### 2. Quản lý Khách hàng
- Danh sách khách hàng với tìm kiếm
- Lọc theo khu vực, phân loại, trạng thái
- Xem chi tiết khách hàng (modal)
- Thông tin cá nhân, tài khoản, giao dịch

### 3. Báo cáo
- **Hiệu suất bán hàng**: Metrics theo broker
- **Hỗ trợ khách hàng**: Quản lý cases, sentiment analysis
- **Tin tức thị trường**: Từ VSD, HNX, HOSE

### 4. Phân tích Hiệu suất
- Biểu đồ xu hướng theo tháng/tuần
- Scatter plot: Số lệnh vs Hoa hồng
- Top 10 Broker theo hoa hồng
- Bảng chi tiết metrics

### 5. Phân tích Dữ liệu
- Thống kê khách hàng VIP/Mass
- Phân bố NAV khách hàng
- Tỷ lệ churn rate
- Phát triển khách hàng

## 🎨 UI Features

- ✅ **Dark Mode**: Toggle dark/light theme
- ✅ **Responsive Design**: Mobile, tablet, desktop
- ✅ **Interactive Charts**: Recharts dengan Tooltip, Legend
- ✅ **Sortable Tables**: Click column header để sort
- ✅ **Search & Filter**: Tìm kiếm nhanh và lọc dữ liệu
- ✅ **Export Ready**: Cấu trúc sẵn cho PDF/Excel export

## 📊 Mock Data

Project sử dụng faker.js để sinh dữ liệu mock hợp lý:

- **150 Khách hàng** với thông tin đầy đủ (cá nhân, tài khoản, giao dịch)
- **~5000 Giao dịch** với symbol stocks, giá, hoa hồng
- **8 KPIs** theo kế hoạch
- **50 Performance reports** cho các broker
- **Support cases** với tracking status
- **Market news** từ các sàn chứng khoán

## 🔄 Kiến trúc Routing

```
/ -> Dashboard
/customers -> Quản lý khách hàng
/reports -> Báo cáo (Performance, Support, News)
/performance -> Phân tích hiệu suất
/analytics -> Phân tích dữ liệu
```

## 📝 Ghi chú

Đây là bản **mockup demo** nhằm giới thiệu cho Broker và thu thập feedback trước khi phát triển backend/database.

### Công việc tiếp theo
- ✅ Mock data & UI
- ⏳ API Integration (khi hoàn thiện yêu cầu)
- ⏳ Database Schema Design
- ⏳ Backend Development
- ⏳ Export to PDF/Excel
- ⏳ User Authentication & Authorization
- ⏳ Real-time Data Updates

## 📧 Contact

Dự án Broker VPS - VPS Securities
