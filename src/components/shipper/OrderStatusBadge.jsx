import { STATUS_META } from "./shipperConstants";

export default function OrderStatusBadge({ status = "PENDING", size = "md" }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  const IconComponent = meta.icon;

  const sizeClass =
    size === "sm"
      ? "px-2.5 py-0.5 text-[11px] gap-1"
      : "px-3.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-black uppercase tracking-wider rounded-full shadow-[var(--shadow-sm)] ${sizeClass} ${meta.badgeClass}`}
    >
      <IconComponent size={size === "sm" ? 12 : 14} />
      <span>{meta.label}</span>
    </span>
  );
}
