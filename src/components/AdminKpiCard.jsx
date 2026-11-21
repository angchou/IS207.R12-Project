// Thẻ hiển thị chỉ số KPI tổng quan dùng cho trang AdminHomePage
export default function AdminKpiCard({
  title,
  value,
  subtext,
  trend,
  trendUp = true,
  icon,
  accentColor = "var(--btn-primary-default)",
}) {
  return (
    <div className="bg-[var(--bg-surface)] p-5 border-2 border-[var(--border-light)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            {value}
          </p>
        </div>

        {/* Biểu tượng KPI bo tròn 50% */}
        <div
          style={{ color: accentColor }}
          className="w-11 h-11 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-divider)] flex items-center justify-center shrink-0"
        >
          {icon}
        </div>
      </div>

      {/* Dòng xu hướng tăng/giảm và chú thích phụ */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-light)] text-xs">
        {trend && (
          <span
            className={`px-2.5 py-0.5 rounded-full font-black ${
              trendUp
                ? "bg-[var(--status-success)]/15 text-[var(--status-success)]"
                : "bg-[var(--status-error)]/15 text-[var(--status-error)]"
            }`}
          >
            {trend}
          </span>
        )}
        <span className="text-[var(--text-secondary)] font-medium truncate">
          {subtext}
        </span>
      </div>
    </div>
  );
}
