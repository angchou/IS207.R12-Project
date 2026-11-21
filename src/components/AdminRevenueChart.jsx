import { useState } from "react";
import { BarChart3, CreditCard } from "lucide-react";

// Component biểu đồ doanh thu theo ngày & tỉ trọng phương thức thanh toán
export default function AdminRevenueChart({
  dailyData,
  paymentBreakdown,
  timeframeLabel,
}) {
  // Ngày đang được chọn để hiển thị số liệu nổi bật
  const [activeIndex, setActiveIndex] = useState(dailyData.length - 1);

  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);
  const safeIndex =
    activeIndex < dailyData.length ? activeIndex : dailyData.length - 1;
  const selectedDay = dailyData[safeIndex] || dailyData[0];

  return (
    <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] p-6 space-y-6">
      {/* Tiêu đề khối biểu đồ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-light)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--btn-primary-default)]">
            <BarChart3 size={15} /> Revenue Performance
          </div>
          <h2 className="text-xl font-black uppercase text-[var(--text-primary)] mt-0.5">
            Sales & Order Volume ({timeframeLabel})
          </h2>
        </div>

        {/* Thông số ngày đang chọn */}
        {selectedDay && (
          <div className="bg-[var(--bg-subtle)] border border-[var(--border-divider)] px-4 py-2 text-right">
            <span className="block text-[11px] font-bold uppercase text-[var(--text-muted)]">
              {selectedDay.label} • {selectedDay.orders} Orders
            </span>
            <span className="text-lg font-black text-[var(--color-price)]">
              ${selectedDay.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Biểu đồ cột doanh thu */}
      <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-[var(--border-light)]">
        {dailyData.map((item, idx) => {
          const heightPercent = Math.max(
            12,
            Math.round((item.revenue / maxRevenue) * 100),
          );
          const isSelected = idx === safeIndex;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="flex-1 h-full flex flex-col items-center justify-end gap-2 group cursor-pointer focus:outline-none"
            >
              <span
                className={`text-[11px] font-bold transition-colors ${
                  isSelected
                    ? "text-[var(--btn-primary-default)]"
                    : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                ${Math.round(item.revenue)}
              </span>

              <div className="w-full max-w-[44px] h-40 bg-[var(--bg-main)] border border-[var(--border-light)] flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full transition-all duration-300 ${
                    isSelected
                      ? "bg-[var(--btn-primary-default)]"
                      : "bg-[var(--btn-secondary-default)]/75 group-hover:bg-[var(--btn-secondary-default)]"
                  }`}
                />
              </div>

              <span
                className={`text-xs font-black uppercase ${
                  isSelected
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phân bổ theo phương thức thanh toán (từ bảng PAYMENT_METHOD) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
          <CreditCard size={15} className="text-[var(--btn-secondary-default)]" />
          Payment Method Breakdown
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {paymentBreakdown.map((pm) => (
            <div
              key={pm.name}
              className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text-primary)] truncate">
                  {pm.name}
                </span>
                <span className="font-black text-[var(--btn-primary-default)]">
                  {pm.share}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--border-light)] overflow-hidden">
                <div
                  style={{ width: `${pm.share}%`, backgroundColor: pm.color }}
                  className="h-full"
                />
              </div>
              <span className="block text-[11px] text-[var(--text-muted)] font-medium">
                {pm.count} orders
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
