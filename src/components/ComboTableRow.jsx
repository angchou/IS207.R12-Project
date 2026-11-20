import { Edit, AlertTriangle } from "lucide-react";
import { ImageThumbnail } from "./ImageInputField";
import { ProductTagBadge } from "./ProductTableRow";
import { COMBO_STATUS, isProductOrderable } from "./comboConstants";

// Mã hiển thị của combo, ví dụ #CMB-501
export function ComboCode({ comboId, className = "text-xs" }) {
  return (
    <p className={`${className} text-[var(--text-muted)] font-mono`}>
      #CMB-{String(comboId).padStart(3, "0")}
    </p>
  );
}

// Badge của combo (cột COMBO.badge), ví dụ "BEST SELLER"
export function ComboBadge({ badge }) {
  if (!badge) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap bg-[var(--btn-primary-default)] text-[var(--text-inverse)]">
      {badge}
    </span>
  );
}

// Cảnh báo combo không đặt được vì có món Sold Out / Unavailable
export function ComboBlockedBadge({ blockers }) {
  if (blockers.length === 0) return null;
  const detail = blockers
    .map((b) => `${b.name} (${b.status.replace("_", " ").toLowerCase()})`)
    .join(", ");
  return (
    <span
      title={`Customers cannot order this combo: ${detail}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap border bg-[var(--status-warning)]/10 text-[var(--status-warning)] border-[var(--status-warning)]/40"
    >
      <AlertTriangle size={10} /> Not orderable
    </span>
  );
}

// Danh sách đầy đủ các món trong combo: "2 × Tên (M)"; món Sold Out / Unavailable hiện màu cảnh báo
export function ComboItemList({ items }) {
  if (items.length === 0) {
    return (
      <span className="text-xs italic text-[var(--text-muted)]">No items</span>
    );
  }
  return (
    <ul className="space-y-1 text-xs">
      {items.map((item) => {
        const blocked = !isProductOrderable(item.product);
        return (
          <li
            key={item.product_size_id}
            className={`flex items-center gap-1.5 ${
              blocked
                ? "text-[var(--status-warning)]"
                : "text-[var(--text-secondary)]"
            }`}
          >
            <span className="font-black shrink-0">{item.quantity} ×</span>
            <span className="truncate max-w-[200px] font-semibold">
              {item.product?.product_name || "Removed item"}
            </span>
            {item.size?.size_name && (
              <span className="text-[var(--text-muted)] shrink-0">
                ({item.size.size_name.charAt(0)})
              </span>
            )}
            {blocked && <AlertTriangle size={11} className="shrink-0" />}
          </li>
        );
      })}
    </ul>
  );
}

// Giá combo + giá gốc gạch ngang + % tiết kiệm
export function ComboPrice({ price, originalPrice }) {
  const savingPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  return (
    <div className="space-y-0.5 whitespace-nowrap">
      <p className="font-black text-[var(--color-price)]">
        ${price.toFixed(2)}
      </p>
      <p className="text-xs text-[var(--text-muted)] line-through">
        ${originalPrice.toFixed(2)}
      </p>
      {savingPercent > 0 && (
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)]">
          Save {savingPercent}%
        </span>
      )}
    </div>
  );
}

// Công tắc mở bán / ngừng bán combo ngay trên bảng (AVAILABLE <-> UNAVAILABLE)
export function ComboStatusToggle({ status, comboName, onToggle }) {
  const isOn = status !== COMBO_STATUS.UNAVAILABLE;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={`${isOn ? "Stop selling" : "Start selling"} ${comboName}`}
      onClick={onToggle}
      className="inline-flex items-center gap-2 py-1.5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      <span
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
          isOn ? "bg-[var(--status-success)]" : "bg-[var(--border-divider)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] transition-transform ${
            isOn ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span
        className={`text-xs font-black uppercase whitespace-nowrap ${
          isOn ? "text-[var(--status-success)]" : "text-[var(--text-muted)]"
        }`}
      >
        {isOn ? "Available" : "Unavailable"}
      </span>
    </button>
  );
}

// Component một dòng combo trong bảng quản lý (màn hình từ md trở lên)
export default function ComboTableRow({
  combo,
  items,
  blockers,
  onToggleStatus,
  onEdit,
}) {
  const isOn = combo.status !== COMBO_STATUS.UNAVAILABLE;

  return (
    <tr className="hover:bg-[var(--bg-main)] transition-colors">
      {/* Cột Combo: ảnh + tên + mã + badge + tag (mờ đi khi ngừng bán) */}
      <td className="px-6 py-4">
        <div className={`flex items-center gap-3 ${isOn ? "" : "opacity-60"}`}>
          <ImageThumbnail
            key={combo.image}
            src={combo.image}
            alt={combo.combo_name}
          />
          <div className="min-w-0 space-y-1">
            <p className="font-bold text-[var(--text-primary)] leading-snug">
              {combo.combo_name}
            </p>
            <ComboCode comboId={combo.combo_id} />
            <div className="flex flex-wrap items-center gap-1.5">
              <ComboBadge badge={combo.badge} />
              <ProductTagBadge tag={combo.tag} />
              <ComboBlockedBadge blockers={blockers} />
            </div>
          </div>
        </div>
      </td>

      {/* Cột các món trong combo (COMBO_DETAIL) */}
      <td className="px-6 py-4">
        <ComboItemList items={items} />
      </td>

      {/* Cột Giá */}
      <td className="px-6 py-4">
        <ComboPrice price={combo.price} originalPrice={combo.original_price} />
      </td>

      {/* Cột Trạng thái */}
      <td className="px-6 py-4">
        <ComboStatusToggle
          status={combo.status}
          comboName={combo.combo_name}
          onToggle={() => onToggleStatus(combo)}
        />
      </td>

      {/* Cột Nút thao tác Sửa */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => onEdit(combo)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer"
          >
            <Edit size={13} /> Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
