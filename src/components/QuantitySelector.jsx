import { Minus, Plus } from "lucide-react";

// Bộ chọn dùng chung: dữ liệu số lượng do trang/giỏ hàng truyền vào quản lý.
export default function QuantitySelector({ quantity, onChange, itemName }) {
  const buttonClassName =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--btn-primary-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:text-[var(--text-muted)] disabled:opacity-50 disabled:hover:bg-[var(--bg-surface)]";

  return (
    <div
      role="group"
      aria-label={`Quantity for ${itemName}`}
      className="inline-flex shrink-0 items-center rounded-full border border-[var(--border-divider)] bg-[var(--bg-surface)] p-0.5"
    >
      {/* Chặn giảm dưới 1; thao tác xóa món có nút riêng trong CartItem. */}
      <button
        type="button"
        aria-label={`Decrease quantity of ${itemName}`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className={buttonClassName}
      >
        <Minus size={16} aria-hidden="true" />
      </button>

      {/* Hiển thị số lượng mới ngay khi trạng thái giỏ hàng thay đổi. */}
      <output
        aria-live="polite"
        aria-atomic="true"
        className="min-w-9 px-2 text-center text-sm font-black tabular-nums text-[var(--text-primary)]"
      >
        {quantity}
      </output>

      <button
        type="button"
        aria-label={`Increase quantity of ${itemName}`}
        onClick={() => onChange(quantity + 1)}
        className={buttonClassName}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
