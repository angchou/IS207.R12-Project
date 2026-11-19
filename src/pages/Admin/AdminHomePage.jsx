import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Flame,
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_COMBOS } from "../../data/mockData";
import AdminKpiCard from "../../components/AdminKpiCard";
import AdminRevenueChart from "../../components/AdminRevenueChart";
import AdminRecentOrdersTable from "../../components/AdminRecentOrdersTable";

// Dữ liệu thống kê theo khung thời gian (Today / 7 Days / 30 Days)
const REPORT_BY_TIMEFRAME = {
  today: {
    label: "Today",
    revenue: "$4,820.50",
    revenueTrend: "+12.4%",
    ordersCount: "128",
    ordersTrend: "+8.1%",
    customers: "342",
    customersTrend: "+15 new",
    avgRating: "4.85 / 5.0",
    ratingSubtext: "From 96 rated orders",
    daily: [
      { label: "08:00", revenue: 320, orders: 12 },
      { label: "10:00", revenue: 540, orders: 18 },
      { label: "12:00", revenue: 1180, orders: 34 },
      { label: "14:00", revenue: 610, orders: 19 },
      { label: "16:00", revenue: 490, orders: 14 },
      { label: "18:00", revenue: 1020, orders: 21 },
      { label: "20:00", revenue: 660.5, orders: 10 },
    ],
  },
  week: {
    label: "Last 7 Days",
    revenue: "$31,450.00",
    revenueTrend: "+16.8%",
    ordersCount: "842",
    ordersTrend: "+11.2%",
    customers: "1,240",
    customersTrend: "+94 new",
    avgRating: "4.88 / 5.0",
    ratingSubtext: "From 612 rated orders",
    daily: [
      { label: "Mon", revenue: 3420, orders: 95 },
      { label: "Tue", revenue: 3890, orders: 108 },
      { label: "Wed", revenue: 4120, orders: 116 },
      { label: "Thu", revenue: 4580, orders: 124 },
      { label: "Fri", revenue: 5340, orders: 142 },
      { label: "Sat", revenue: 5620, orders: 151 },
      { label: "Sun", revenue: 4480, orders: 106 },
    ],
  },
  month: {
    label: "Last 30 Days",
    revenue: "$128,940.00",
    revenueTrend: "+21.5%",
    ordersCount: "3,410",
    ordersTrend: "+14.9%",
    customers: "4,820",
    customersTrend: "+380 new",
    avgRating: "4.86 / 5.0",
    ratingSubtext: "From 2,490 rated orders",
    daily: [
      { label: "Wk 1", revenue: 28400, orders: 760 },
      { label: "Wk 2", revenue: 31200, orders: 830 },
      { label: "Wk 3", revenue: 33890, orders: 895 },
      { label: "Wk 4", revenue: 35450, orders: 925 },
    ],
  },
};

// Tỉ trọng phương thức thanh toán (dựa trên bảng PAYMENT_METHOD & ORDER)
const PAYMENT_BREAKDOWN = [
  {
    name: "E-Wallet",
    share: 42,
    count: 54,
    color: "var(--btn-primary-default)",
  },
  {
    name: "Credit Card",
    share: 28,
    count: 36,
    color: "var(--btn-secondary-default)",
  },
  {
    name: "Cash on Delivery",
    share: 20,
    count: 25,
    color: "var(--btn-accent-default)",
  },
  {
    name: "Bank Transfer",
    share: 10,
    count: 13,
    color: "var(--status-info)",
  },
];

// Dữ liệu đơn hàng mẫu mô phỏng bảng ORDER, ORDER_STATUS, STATUS, PAYMENT_METHOD, ACCOUNT
const MOCK_ORDERS = [
  {
    order_id: 1041,
    order_code: "#ORD-1041",
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi Street, Ben Nghe Ward, District 1, HCMC",
    payment_name: "E-Wallet",
    shipper_name: "David Tran",
    total: 34.48,
    earned_point: 344,
    used_point: 50,
    customer_note: "Extra spicy dipping sauce on the side, please.",
    cancel_reason: "",
    rating: 5,
    status_name: "Completed",
    created_at: "Nov 19, 2026 17:40",
  },
  {
    order_id: 1042,
    order_code: "#ORD-1042",
    receiver_name: "Emily Carter",
    phone_number: "0912445789",
    full_address: "45 Nguyen Hue Blvd, District 1, HCMC",
    payment_name: "Credit Card",
    shipper_name: "Minh Nguyen",
    total: 24.99,
    earned_point: 249,
    used_point: 0,
    customer_note: "Call upon arrival at lobby.",
    cancel_reason: "",
    rating: 0,
    status_name: "Delivering",
    created_at: "Nov 19, 2026 17:52",
  },
  {
    order_id: 1043,
    order_code: "#ORD-1043",
    receiver_name: "Michael Lee",
    phone_number: "0988776543",
    full_address: "88 Dien Bien Phu, Binh Thanh District, HCMC",
    payment_name: "Cash on Delivery",
    shipper_name: "",
    total: 41.2,
    earned_point: 412,
    used_point: 100,
    customer_note: "No pickles in both burgers.",
    cancel_reason: "",
    rating: 0,
    status_name: "Preparing",
    created_at: "Nov 19, 2026 18:01",
  },
  {
    order_id: 1044,
    order_code: "#ORD-1044",
    receiver_name: "Sophia Pham",
    phone_number: "0933556112",
    full_address: "12 Tran Hung Dao, District 5, HCMC",
    payment_name: "Bank Transfer",
    shipper_name: "",
    total: 18.5,
    earned_point: 185,
    used_point: 0,
    customer_note: "",
    cancel_reason: "",
    rating: 0,
    status_name: "Pending",
    created_at: "Nov 19, 2026 18:05",
  },
  {
    order_id: 1045,
    order_code: "#ORD-1045",
    receiver_name: "Daniel Vo",
    phone_number: "0977112233",
    full_address: "210 Vo Van Ngan, Thu Duc City, HCMC",
    payment_name: "E-Wallet",
    shipper_name: "David Tran",
    total: 22.0,
    earned_point: 0,
    used_point: 0,
    customer_note: "",
    cancel_reason: "Customer changed delivery address outside service zone.",
    rating: 0,
    status_name: "Canceled",
    created_at: "Nov 19, 2026 16:50",
  },
  {
    order_id: 1046,
    order_code: "#ORD-1046",
    receiver_name: "Hannah Nguyen",
    phone_number: "0909887766",
    full_address: "55 Phan Xich Long, Phu Nhuan District, HCMC",
    payment_name: "Credit Card",
    shipper_name: "Minh Nguyen",
    total: 29.97,
    earned_point: 299,
    used_point: 0,
    customer_note: "Leave with building receptionist.",
    cancel_reason: "",
    rating: 5,
    status_name: "Completed",
    created_at: "Nov 19, 2026 16:15",
  },
];

export default function AdminHomePage() {
  // Khung thời gian báo cáo đang chọn: today | week | month
  const [timeframe, setTimeframe] = useState("today");
  const currentReport = REPORT_BY_TIMEFRAME[timeframe];

  // Lấy top 4 món ăn / combo nổi bật dựa trên lượt đánh giá (từ MOCK_PRODUCTS & MOCK_COMBOS)
  const topMenuItems = useMemo(() => {
    const productList = MOCK_PRODUCTS.slice(0, 3).map((p) => ({
      id: `p-${p.product_id}`,
      name: p.product_name,
      image: p.image,
      price: p.sizes?.[0]?.price || 0,
      reviews: p.review_count || 0,
      rating: p.rating || 4.8,
      badge: "Menu",
    }));

    const featuredCombo = MOCK_COMBOS[0]
      ? [
          {
            id: `c-${MOCK_COMBOS[0].combo_id}`,
            name: MOCK_COMBOS[0].combo_name,
            image: MOCK_COMBOS[0].image,
            price: MOCK_COMBOS[0].price,
            reviews: 245,
            rating: 4.9,
            badge: MOCK_COMBOS[0].badge,
          },
        ]
      : [];

    return [...featuredCombo, ...productList];
  }, []);

  // Thống kê nhanh số lượng đơn theo trạng thái hiện tại
  const statusSummary = useMemo(() => {
    const counts = { Completed: 0, Delivering: 0, Preparing: 0, Pending: 0, Canceled: 0 };
    MOCK_ORDERS.forEach((o) => {
      if (counts[o.status_name] !== undefined) counts[o.status_name] += 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)] pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* ================= 1. TIÊU ĐỀ DASHBOARD & BỘ CHỌN THỜI GIAN ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <LayoutDashboard size={14} /> Store Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Admin Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
              Track daily store revenue, live order fulfillment, customer
              satisfaction, and navigate management modules.
            </p>
          </div>

          {/* Nút chuyển đổi khung thời gian báo cáo (bo 50%) */}
          <div className="flex items-center gap-2">
            {[
              { id: "today", label: "Today" },
              { id: "week", label: "7 Days" },
              { id: "month", label: "30 Days" },
            ].map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  timeframe === tf.id
                    ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)] shadow-[var(--shadow-sm)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 2. CÁC THẺ KPI CHÍNH ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AdminKpiCard
            title={`Gross Revenue (${currentReport.label})`}
            value={currentReport.revenue}
            trend={currentReport.revenueTrend}
            subtext="vs previous period"
            icon={<DollarSign size={22} />}
            accentColor="var(--btn-primary-default)"
          />
          <AdminKpiCard
            title={`Total Orders (${currentReport.label})`}
            value={currentReport.ordersCount}
            trend={currentReport.ordersTrend}
            subtext={`${statusSummary.Preparing + statusSummary.Delivering} active now`}
            icon={<ShoppingBag size={22} />}
            accentColor="var(--btn-secondary-default)"
          />
          <AdminKpiCard
            title="Active Customers"
            value={currentReport.customers}
            trend={currentReport.customersTrend}
            subtext="Loyalty members"
            icon={<Users size={22} />}
            accentColor="var(--status-info)"
          />
          <AdminKpiCard
            title="Store Rating"
            value={currentReport.avgRating}
            trend="Top Rated"
            subtext={currentReport.ratingSubtext}
            icon={<Star size={22} />}
            accentColor="var(--status-success)"
          />
        </div>

        {/* ================= 3. BIỂU ĐỒ DOANH THU & MÓN BÁN CHẠY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột trái (8 cột): Biểu đồ doanh thu & thanh toán */}
          <div className="lg:col-span-8">
            <AdminRevenueChart
              dailyData={currentReport.daily}
              paymentBreakdown={PAYMENT_BREAKDOWN}
              timeframeLabel={currentReport.label}
            />
          </div>

          {/* Cột phải (4 cột): Món bán chạy & tóm tắt trạng thái đơn */}
          <div className="lg:col-span-4 space-y-6">
            {/* Danh sách món ăn / combo nổi bật */}
            <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3">
                <h2 className="text-base font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
                  <Flame size={18} className="text-[var(--btn-primary-default)]" />
                  Top Selling Items
                </h2>
                <a
                  href="/admin/product"
                  className="text-xs font-bold uppercase text-[var(--btn-primary-default)] hover:underline"
                >
                  Manage
                </a>
              </div>

              <div className="space-y-3">
                {topMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 bg-[var(--bg-main)] border border-[var(--border-light)]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-[var(--border-divider)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-0.5 font-bold text-[var(--text-secondary)]">
                          <Star
                            size={11}
                            className="text-[var(--color-rating-star)] fill-[var(--color-rating-star)]"
                          />
                          {item.rating}
                        </span>
                        <span>({item.reviews} reviews)</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[var(--color-price)] shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tóm tắt trạng thái xử lý đơn hàng hiện tại */}
            <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2.5">
                Live Order Queue
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)]">
                  <span className="text-[var(--text-muted)] font-bold block">
                    Pending / Kitchen
                  </span>
                  <span className="text-lg font-black text-[var(--status-warning)]">
                    {statusSummary.Pending + statusSummary.Preparing}
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)]">
                  <span className="text-[var(--text-muted)] font-bold block">
                    Out for Delivery
                  </span>
                  <span className="text-lg font-black text-[var(--status-info)]">
                    {statusSummary.Delivering}
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)]">
                  <span className="text-[var(--text-muted)] font-bold block">
                    Completed
                  </span>
                  <span className="text-lg font-black text-[var(--status-success)]">
                    {statusSummary.Completed}
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)]">
                  <span className="text-[var(--text-muted)] font-bold block">
                    Canceled
                  </span>
                  <span className="text-lg font-black text-[var(--status-error)]">
                    {statusSummary.Canceled}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4. BẢNG ĐƠN HÀNG GẦN ĐÂY ================= */}
        <AdminRecentOrdersTable orders={MOCK_ORDERS} />
      </div>
    </div>
  );
}
