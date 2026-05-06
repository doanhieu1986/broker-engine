# Data Model — Broker VPS Management System

> **Mục đích**: Phân nhóm dữ liệu theo chủ đề, xác định nguồn dữ liệu, data model cốt lõi và feature store (dữ liệu phái sinh) phục vụ hệ thống quản lý Broker VPS.

---

## Mục lục

1. [Phân nhóm dữ liệu theo chủ đề](#1-phân-nhóm-dữ-liệu-theo-chủ-đề)
2. [Nguồn dữ liệu](#2-nguồn-dữ-liệu)
3. [Core Data Models (Bảng gốc)](#3-core-data-models-bảng-gốc)
4. [Feature Store (Dữ liệu phái sinh)](#4-feature-store-dữ-liệu-phái-sinh)
5. [Sơ đồ quan hệ](#5-sơ-đồ-quan-hệ)

---

## 1. Phân nhóm dữ liệu theo chủ đề

| # | Nhóm chủ đề | Mô tả | Dashboard liên quan |
|---|-------------|-------|---------------------|
| D1 | **Khách hàng** | Hồ sơ, phân loại, hành vi khách hàng | Customers, Customer Detail |
| D2 | **Giao dịch** | Lệnh mua/bán, khối lượng, phí | Dashboard KPI, Analytics |
| D3 | **Tài sản & Tài chính** | NAV, AUM, margin, số dư | Dashboard KPI, Customer Detail |
| D4 | **Broker & Nhân sự** | Thông tin broker, nhân viên, phân cấp | Broker Detail, Reports |
| D5 | **KPI & Hiệu suất** | Kế hoạch, thực hiện, xu hướng | Dashboard, Performance |
| D6 | **Chăm sóc khách hàng** | Case khiếu nại, tư vấn, chăm sóc | Reports |
| D7 | **Thị trường & Tin tức** | Giá cổ phiếu, tin tức, khuyến nghị | Market Feed |
| D8 | **Hệ thống & Người dùng** | Phân quyền, thông báo, audit log | Layout, Notifications |

---

## 2. Nguồn dữ liệu

### 2.1 Nguồn dữ liệu nội bộ (Internal)

| Nguồn | Nhóm | Dữ liệu cung cấp |
|-------|------|------------------|
| Core Banking / Trading System | D1, D2, D3 | Thông tin tài khoản, lệnh giao dịch, số dư, NAV |
| CRM nội bộ VPS | D1, D6 | Hồ sơ khách hàng, case hỗ trợ, lịch sử tương tác |
| HR System | D4 | Hồ sơ nhân viên broker, cấp bậc, ngày onboard |
| KPI Planning System | D5 | Kế hoạch tháng/quý/năm theo team và công ty |
| Auth / IAM System | D8 | Thông tin người dùng, phân quyền, vai trò |
| Margin Management System | D3 | Tỷ lệ margin, trạng thái call margin / force sell |

### 2.2 Nguồn dữ liệu bên ngoài (External)

| Nguồn | Nhóm | Dữ liệu cung cấp | Tần suất cập nhật |
|-------|------|------------------|-------------------|
| **VSD** (Trung tâm Lưu ký) | D1, D2 | Xác nhận quyền sở hữu, lịch sử nắm giữ | T+1 |
| **HOSE** | D2, D7 | Giá cổ phiếu, khối lượng khớp lệnh, chỉ số VN-Index | Realtime / EOD |
| **HNX** | D2, D7 | Giá cổ phiếu sàn HNX, HNX30, UPCOM | Realtime / EOD |
| **Tin tức tài chính** (RSS/API) | D7 | Bản tin thị trường, khuyến nghị phân tích | Realtime |

---

## 3. Core Data Models (Bảng gốc)

### D1 — KHÁCH HÀNG

#### `dim_customer` — Hồ sơ khách hàng
```
customer_id         UUID          PK
account_number      VARCHAR(10)   Số tài khoản (VD: A56122X)
full_name           VARCHAR(100)
gender              ENUM('Nam','Nữ')
dob                 DATE
id_card             VARCHAR(12)   CCCD/CMND
id_card_issued_date DATE
id_card_issued_place VARCHAR(100)
phone               VARCHAR(15)
email               VARCHAR(100)
occupation          VARCHAR(100)
hobbies             TEXT[]
region              VARCHAR(50)   Khu vực/tỉnh thành
account_open_date   DATE
broker_code         VARCHAR(10)   FK → dim_broker
classification      ENUM('VIP','Affluent','Mass Affluent','Mass')
risk_appetite       ENUM('Cao','Thấp','Cân bằng')
preferred_products  TEXT[]        ['Chứng khoán','Trái phiếu','Quỹ mở','Phái sinh','Huy động vốn']
interested_industries TEXT[]
nav_group           ENUM('Nhóm A (>2B)','Nhóm B (500M-2B)','Nhóm C (100-500M)')
commission_rate     DECIMAL(5,2)  Tỷ lệ phí %
fee_schedule        VARCHAR(50)   VD: 'V13 - Gói phí 0.15%'
active_policies     TEXT[]
financial_services  TEXT[]
active_status       BOOLEAN       Có giao dịch trong 30 ngày
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### `dim_account_snapshot` — Snapshot tài khoản theo ngày
```
snapshot_id         UUID          PK
customer_id         UUID          FK → dim_customer
snapshot_date       DATE
nav                 BIGINT        Giá trị tài sản ròng (VND)
aum                 BIGINT        Tài sản quản lý (VND)
total_balance       BIGINT        Số dư tài khoản
invested_value      BIGINT        Giá trị đã đầu tư
cash_balance        BIGINT        Số dư tiền mặt
profit              BIGINT        Lãi/lỗ (VND)
profit_rate         DECIMAL(8,4)  Tỷ suất lợi nhuận %
```

---

### D2 — GIAO DỊCH

#### `fact_transaction` — Bảng giao dịch chi tiết
```
transaction_id      UUID          PK
customer_id         UUID          FK → dim_customer
account_number      VARCHAR(10)
broker_code         VARCHAR(10)   FK → dim_broker
transaction_date    DATE
settlement_date     DATE          Ngày thanh toán T+2
symbol              VARCHAR(10)   Mã cổ phiếu (VD: VNM, HPG)
exchange            ENUM('HOSE','HNX','UPCOM')
trade_type          ENUM('Mua','Bán')
quantity            INT
price               BIGINT        Giá/cổ phiếu (VND)
amount              BIGINT        Giá trị lệnh (VND)
commission          BIGINT        Phí môi giới (VND)
tax                 BIGINT        Thuế (VND)
net_amount          BIGINT        Giá trị thuần (VND)
order_status        ENUM('Khớp','Hủy','Chờ khớp')
session             ENUM('Sáng','Chiều','ATO','ATC')
```

#### `dim_symbol` — Danh mục mã chứng khoán
```
symbol              VARCHAR(10)   PK
company_name        VARCHAR(200)
exchange            ENUM('HOSE','HNX','UPCOM')
industry_sector     VARCHAR(100)
stock_type          ENUM('Bluechip','Midcap','Penny')
market_cap_tier     ENUM('Large','Mid','Small')
listed_date         DATE
```

---

### D3 — TÀI SẢN & MARGIN

#### `fact_portfolio_holding` — Danh mục đang nắm giữ
```
holding_id          UUID          PK
customer_id         UUID          FK → dim_customer
account_number      VARCHAR(10)
snapshot_date       DATE
symbol              VARCHAR(10)   FK → dim_symbol
quantity            INT
avg_cost            BIGINT        Giá vốn trung bình
current_price       BIGINT        Giá hiện tại
market_value        BIGINT        Giá trị thị trường
unrealized_pnl      BIGINT        Lãi/lỗ chưa thực hiện
weight_pct          DECIMAL(5,2)  Tỷ trọng trong danh mục %
```

#### `fact_margin_status` — Trạng thái margin theo ngày
```
margin_id           UUID          PK
customer_id         UUID          FK → dim_customer
account_number      VARCHAR(10)
broker_code         VARCHAR(10)   FK → dim_broker
branch              VARCHAR(100)
snapshot_date       DATE
total_asset_value   BIGINT
total_debt          BIGINT
equity              BIGINT
current_margin_ratio DECIMAL(5,2)
maintenance_ratio   DECIMAL(5,2)  Ngưỡng duy trì (default 85%)
force_sell_ratio    DECIMAL(5,2)  Ngưỡng bán cưỡng chế (default 80%)
margin_status       ENUM('Monitoring','Warning','Call Margin','Force Sell')
call_amount         BIGINT        Số tiền cần bổ sung
sell_amount_to_cover BIGINT
call_date           DATE
due_date            DATE
expected_force_sell_date DATE
```

---

### D4 — BROKER & NHÂN SỰ

#### `dim_broker` — Thông tin broker
```
broker_code         VARCHAR(10)   PK
broker_name         VARCHAR(100)
email               VARCHAR(100)
phone               VARCHAR(15)
branch              VARCHAR(100)  Chi nhánh
manager_code        VARCHAR(10)   FK → dim_broker (self-ref)
role                ENUM('Director','Manager','Broker')
onboard_date        DATE
latest_official_date DATE
active_status       BOOLEAN
```

#### `dim_staff` — Nhân viên / cộng tác viên
```
staff_id            UUID          PK
broker_code         VARCHAR(10)   FK → dim_broker (quản lý trực tiếp)
staff_name          VARCHAR(100)
email               VARCHAR(100)
sales_type          ENUM('Cộng tác viên','Nhân viên chính thức cấp 1','Nhân viên chính thức cấp 2')
position            VARCHAR(100)  VD: 'Giám đốc TVĐT', 'Chuyên viên tư vấn'
onboard_date        DATE
latest_official_date DATE
direct_manager      VARCHAR(100)
nav_transferred_in  BIGINT        NAV được chuyển đến
nav_transferred_out BIGINT        NAV chuyển đi
customers_transferred_in  INT
customers_transferred_out INT
```

#### `fact_customer_broker_assignment` — Lịch sử phân công khách hàng
```
assignment_id       UUID          PK
customer_id         UUID          FK → dim_customer
broker_code         VARCHAR(10)   FK → dim_broker
assigned_date       DATE
end_date            DATE          NULL = đang quản lý
nav_at_assignment   BIGINT
reason              VARCHAR(200)  Lý do chuyển đổi
```

---

### D5 — KPI & HIỆU SUẤT

#### `dim_kpi_plan` — Kế hoạch KPI
```
plan_id             UUID          PK
period              VARCHAR(20)   VD: '2025-05', '2025-Q2'
period_type         ENUM('monthly','quarterly','yearly')
scope_type          ENUM('company','team','individual')
scope_id            VARCHAR(20)   broker_code hoặc team_id
kpi_name            VARCHAR(100)
kpi_category        ENUM('new_accounts','commission','trading_value','orders','active_rate','staff_count','trading_volume','trading_frequency')
target_value        DECIMAL(20,4)
unit                VARCHAR(20)
created_at          TIMESTAMP
```

#### `fact_kpi_actual` — Thực tế KPI theo kỳ
```
actual_id           UUID          PK
plan_id             UUID          FK → dim_kpi_plan
snapshot_date       DATE
scope_type          ENUM('company','team','individual')
scope_id            VARCHAR(20)
actual_value        DECIMAL(20,4)
achievement_pct     DECIMAL(6,2)  % hoàn thành kế hoạch
trend_pct           DECIMAL(6,2)  % thay đổi so với kỳ trước
```

#### `fact_performance_report` — Báo cáo hiệu suất broker theo kỳ
```
report_id           UUID          PK
broker_code         VARCHAR(10)   FK → dim_broker
period              VARCHAR(20)
new_accounts_opened INT
total_commission    BIGINT
total_trading_value BIGINT
total_orders        INT
active_accounts     INT
active_accounts_ratio DECIMAL(5,2)
staff_count         INT
trading_volume      BIGINT
trading_frequency   DECIMAL(5,2)  Giao dịch/ngày trung bình
```

---

### D6 — CHĂM SÓC KHÁCH HÀNG

#### `fact_support_case` — Case hỗ trợ khách hàng
```
case_id             UUID          PK
customer_id         UUID          FK → dim_customer
broker_code         VARCHAR(10)   FK → dim_broker
case_type           ENUM('Khiếu nại','Hỗ trợ','Tư vấn')
case_status         ENUM('Mở','Đang xử lý','Đã giải quyết')
sentiment           ENUM('Tích cực','Trung lập','Tiêu cực')
created_date        DATE
resolved_date       DATE
resolution_time_hrs INT           Thời gian xử lý (giờ)
description         TEXT
resolution_note     TEXT
```

#### `fact_customer_care_activity` — Nhật ký chăm sóc khách hàng
```
activity_id         UUID          PK
customer_id         UUID          FK → dim_customer
broker_code         VARCHAR(10)
activity_date       DATE
channel             ENUM('Zalo','Facebook','Telegram','Viber','Phone','Email','Gặp mặt')
activity_type       ENUM('Chúc mừng sinh nhật','Tư vấn giao dịch','Giới thiệu sản phẩm','Follow-up margin','Khác')
note                TEXT
next_action         TEXT
care_scenario       VARCHAR(200)  VD: 'Tặng hoa & Gọi điện'
```

---

### D7 — THỊ TRƯỜNG & TIN TỨC

#### `fact_market_price` — Giá thị trường theo phiên
```
price_id            UUID          PK
symbol              VARCHAR(10)   FK → dim_symbol
trade_date          DATE
session             ENUM('ATO','MORNING','AFTERNOON','ATC')
open_price          BIGINT
high_price          BIGINT
low_price           BIGINT
close_price         BIGINT
ref_price           BIGINT        Giá tham chiếu
volume              BIGINT
value               BIGINT        Giá trị khớp lệnh
change_value        INT
change_pct          DECIMAL(6,2)
foreign_buy         BIGINT
foreign_sell        BIGINT
```

#### `dim_market_news` — Tin tức thị trường
```
news_id             UUID          PK
title               VARCHAR(500)
content             TEXT
source              VARCHAR(100)  HOSE, HNX, VSD, Báo chứng khoán...
category            ENUM('VSD','HNX','HOSE','Tin tức chứng khoán')
published_date      TIMESTAMP
related_symbols     TEXT[]        Các mã cổ phiếu liên quan
recommendation_type ENUM('Mua','Giữ','Bán') NULLABLE
sentiment_score     DECIMAL(3,2)  AI-scored -1.0 to 1.0
```

---

### D8 — HỆ THỐNG & NGƯỜI DÙNG

#### `dim_user` — Người dùng hệ thống
```
user_id             UUID          PK
broker_code         VARCHAR(10)   FK → dim_broker
email               VARCHAR(100)
role                ENUM('director','manager','broker')
managed_broker_codes TEXT[]       Danh sách broker được quản lý (với Manager/Director)
is_active           BOOLEAN
last_login          TIMESTAMP
```

#### `fact_notification` — Thông báo hệ thống
```
notification_id     UUID          PK
user_id             UUID          FK → dim_user
priority            ENUM('urgent','high','medium','low')
category            ENUM('margin','kpi','support','staff','customer','market')
title               VARCHAR(200)
description         TEXT
is_read             BOOLEAN
created_at          TIMESTAMP
expires_at          TIMESTAMP
```

---

## 4. Feature Store (Dữ liệu phái sinh)

Các bảng phái sinh được tính toán/aggregate từ dữ liệu gốc, phục vụ dashboard và báo cáo. Cập nhật theo batch (daily/monthly) hoặc realtime tùy yêu cầu.

### F1 — Đặc trưng khách hàng (Customer Features)

#### `feat_customer_trading_behavior` — Hành vi giao dịch (cập nhật daily)
```
feature_id          UUID          PK
customer_id         UUID          FK → dim_customer
snapshot_date       DATE

-- Tần suất giao dịch
trade_count_7d      INT           Số lệnh 7 ngày
trade_count_30d     INT           Số lệnh 30 ngày
trade_count_90d     INT           Số lệnh 90 ngày
trade_freq_weekly   DECIMAL(5,2)  Lệnh/tuần trung bình
trade_freq_monthly  DECIMAL(5,2)  Lệnh/tháng trung bình
last_trade_date     DATE
days_since_last_trade INT

-- Giá trị giao dịch
trading_value_7d    BIGINT
trading_value_30d   BIGINT
trading_value_90d   BIGINT

-- Mã giao dịch nhiều nhất
top_symbols_30d     TEXT[]        Top 5 mã giao dịch nhiều nhất
top_symbols_90d     TEXT[]
top_industries_30d  TEXT[]        Top ngành nghề theo giá trị

-- Hiệu quả giao dịch
avg_profit_per_trade DECIMAL(10,2)
win_rate_30d        DECIMAL(5,2)  % lệnh có lãi
realized_pnl_30d    BIGINT

-- Hành vi sản phẩm
active_products     TEXT[]        Sản phẩm đang dùng thực tế
app_login_count_7d  INT
app_login_count_30d INT
```

#### `feat_customer_financial_health` — Sức khỏe tài chính (cập nhật daily)
```
feature_id          UUID          PK
customer_id         UUID          FK → dim_customer
snapshot_date       DATE

-- NAV & Balance
nav_current         BIGINT
nav_max_ever        BIGINT        NAV cao nhất từ khi mở tài khoản
nav_30d_ago         BIGINT
nav_change_30d_pct  DECIMAL(6,2)  % biến động NAV 30 ngày
nav_volatility_90d  DECIMAL(6,2)  Độ lệch chuẩn NAV 90 ngày

-- AUM & Margin
aum_current         BIGINT
margin_usage_pct    DECIMAL(5,2)  % sử dụng margin
margin_status       ENUM('Monitoring','Warning','Call Margin','Force Sell')
days_at_warning     INT           Số ngày ở trạng thái Warning+

-- Phân nhóm NAV
nav_tier            ENUM('A','B','C')   A>2B, B=500M-2B, C<500M
nav_rank            INT           Xếp hạng NAV trong toàn bộ khách hàng
nav_percentile      DECIMAL(5,2)  Phân vị NAV
```

#### `feat_customer_segment` — Phân khúc & gắn nhãn khách hàng (cập nhật weekly)
```
feature_id          UUID          PK
customer_id         UUID          FK → dim_customer
snapshot_date       DATE

-- Phân loại hiện tại
classification_current  ENUM('VIP','Affluent','Mass Affluent','Mass')
classification_previous ENUM('VIP','Affluent','Mass Affluent','Mass')
classification_changed_date DATE

-- Churn Risk
churn_risk_score    DECIMAL(5,4)  0.0-1.0, model ML
churn_risk_label    ENUM('Low','Medium','High','Critical')
days_to_churn_estimate INT

-- Engagement Score
engagement_score    DECIMAL(5,2)  Tổng hợp: trading + login + care
loyalty_months      INT           Số tháng là khách hàng active

-- Next Best Action
nba_priority_1      VARCHAR(200)  Gợi ý hành động ưu tiên
nba_priority_2      VARCHAR(200)
nba_priority_3      VARCHAR(200)

-- Lifecycle
customer_lifecycle  ENUM('Onboarding','Active','At-Risk','Dormant','Churned')
account_age_months  INT
```

---

### F2 — Đặc trưng Broker (Broker Features)

#### `feat_broker_performance_monthly` — Hiệu suất broker theo tháng (cập nhật monthly)
```
feature_id          UUID          PK
broker_code         VARCHAR(10)   FK → dim_broker
period              VARCHAR(20)   '2025-05'

-- KPI Thực tế
new_accounts_opened    INT
total_commission       BIGINT
commission_achievement_pct DECIMAL(6,2)  % hoàn thành KPI
total_trading_value    BIGINT
trading_value_achievement_pct DECIMAL(6,2)
total_orders           INT
active_customers       INT
active_rate_pct        DECIMAL(5,2)

-- Portfolio khách hàng
customer_count         INT
total_nav_managed      BIGINT
total_aum_managed      BIGINT
avg_nav_per_customer   BIGINT
vip_customer_count     INT
dormant_customer_count INT
churn_count_month      INT
new_customer_count     INT

-- Rủi ro
margin_call_count      INT         Số KH đang Call Margin
force_sell_count       INT         Số KH đang Force Sell
total_margin_debt      BIGINT

-- Xếp hạng
commission_rank        INT         Xếp hạng trong team
trading_value_rank     INT
```

#### `feat_broker_team_summary` — Tổng hợp team (cập nhật daily)
```
feature_id          UUID          PK
manager_code        VARCHAR(10)   FK → dim_broker (manager)
snapshot_date       DATE

staff_count         INT
total_customers     INT
total_nav           BIGINT
total_aum           BIGINT
total_commission_mtd BIGINT       Month-to-date
total_orders_mtd    INT
active_customer_count INT
churn_rate_30d      DECIMAL(5,2)
new_accounts_mtd    INT
margin_alert_count  INT
pending_support_cases INT
```

---

### F3 — KPI & Hiệu suất tổng hợp (Aggregated KPIs)

#### `feat_kpi_summary` — Bảng tổng hợp KPI dashboard (cập nhật daily)
```
feature_id          UUID          PK
scope_type          ENUM('company','team','individual')
scope_id            VARCHAR(20)
snapshot_date       DATE
period              VARCHAR(20)

total_customers          INT
active_customers         INT
active_customer_rate_pct DECIMAL(5,2)
new_accounts_mtd         INT
new_accounts_ytd         INT

total_commission_mtd     BIGINT
total_commission_ytd     BIGINT
commission_vs_plan_pct   DECIMAL(6,2)

total_trading_value_mtd  BIGINT
total_orders_mtd         INT
total_nav                BIGINT
total_aum                BIGINT

staff_count              INT
churn_rate_30d           DECIMAL(5,2)
```

#### `feat_monthly_trend` — Xu hướng theo tháng (12 tháng rolling)
```
feature_id          UUID          PK
scope_type          ENUM('company','team','individual')
scope_id            VARCHAR(20)
period              VARCHAR(20)   'YYYY-MM'

revenue             BIGINT        Phí HHMG
orders              INT           Số lệnh
customers           INT           Số KH active
new_customers       INT
churn_customers     INT
churn_rate_pct      DECIMAL(5,2)
trading_value       BIGINT
avg_nav             BIGINT
```

---

### F4 — Báo cáo định kỳ (Scheduled Reports)

#### `feat_birthday_report` — Khách hàng sinh nhật sắp tới (cập nhật daily)
```
report_id           UUID          PK
snapshot_date       DATE
customer_id         UUID          FK → dim_customer
customer_name       VARCHAR(100)
dob                 DATE
days_until_birthday INT
classification      ENUM('VIP','Affluent','Mass Affluent','Mass')
broker_code         VARCHAR(10)
broker_name         VARCHAR(100)
phone               VARCHAR(15)
care_scenario       VARCHAR(200)  Logic gợi ý: VIP → Tặng hoa, Mass → Voucher...
care_status         VARCHAR(100)
stt                 INT
```

#### `feat_margin_alert_report` — Khách hàng cần chú ý margin (cập nhật 15 phút/lần)
```
report_id           UUID          PK
snapshot_datetime   TIMESTAMP
customer_id         UUID          FK → dim_customer
account_number      VARCHAR(10)
broker_code         VARCHAR(10)
branch              VARCHAR(100)
current_margin_ratio   DECIMAL(5,2)
maintenance_ratio      DECIMAL(5,2)
force_sell_ratio       DECIMAL(5,2)
margin_status          ENUM('Warning','Call Margin','Force Sell')
total_asset_value      BIGINT
total_debt             BIGINT
equity                 BIGINT
call_amount            BIGINT
sell_amount_to_cover   BIGINT
call_date              DATE
due_date               DATE
expected_force_sell_date DATE
```

#### `feat_staff_promotion_potential` — Tiềm năng thăng cấp nhân viên (cập nhật monthly)
```
report_id           UUID          PK
snapshot_date       DATE
staff_id            UUID          FK → dim_staff
staff_name          VARCHAR(100)
current_level       ENUM('Cộng tác viên','Nhân viên chính thức cấp 1','Nhân viên chính thức cấp 2')
target_level        ENUM('Nhân viên chính thức cấp 1','Nhân viên chính thức cấp 2')
achievement_pct     DECIMAL(5,2)  % hoàn thành điều kiện thăng cấp
days_in_company     INT
commission_accumulated BIGINT
recommendation      VARCHAR(200)
readiness_score     DECIMAL(5,2)
```

---

## 5. Sơ đồ quan hệ

```
dim_broker ←──────────────── dim_user
    │                              
    ├──── dim_staff                
    │                              
    ├──── dim_customer ────────────────────────────────────┐
    │         │                                            │
    │         ├── fact_transaction                         │
    │         ├── dim_account_snapshot                     │
    │         ├── fact_portfolio_holding → dim_symbol      │
    │         ├── fact_margin_status                       │
    │         ├── fact_support_case                        │
    │         ├── fact_customer_care_activity              │
    │         └── fact_customer_broker_assignment          │
    │                                                      │
    └──── dim_kpi_plan → fact_kpi_actual                  │
              │                                            │
              └── fact_performance_report                  │
                                                           │
dim_symbol → fact_market_price                            │
                                                           │
── Feature Store ──────────────────────────────────────────┘
    │
    ├── feat_customer_trading_behavior     (daily, per customer)
    ├── feat_customer_financial_health     (daily, per customer)
    ├── feat_customer_segment              (weekly, per customer)
    │
    ├── feat_broker_performance_monthly    (monthly, per broker)
    ├── feat_broker_team_summary           (daily, per manager)
    │
    ├── feat_kpi_summary                  (daily, per scope)
    ├── feat_monthly_trend                (daily, per scope)
    │
    ├── feat_birthday_report              (daily)
    ├── feat_margin_alert_report          (15 min)
    └── feat_staff_promotion_potential    (monthly)
```

---

## 6. Ghi chú về Data Governance

| Vấn đề | Ghi chú |
|--------|---------|
| **PII** | `dim_customer`: name, phone, email, id_card → cần mã hóa/masking theo role |
| **Phân quyền** | Broker chỉ thấy dữ liệu KH của mình; Manager thấy toàn team; Director thấy tất cả |
| **Data freshness** | Margin alert cần near-realtime (≤15 phút); KPI daily là đủ; Feature store chấp nhận T+1 |
| **Historical** | Giữ lại `fact_transaction` và `dim_account_snapshot` ≥ 3 năm để phân tích trend |
| **Data lineage** | Tất cả feature store cần có `snapshot_date` để reproducible báo cáo tại thời điểm bất kỳ |
