import { useState } from "react";
import { Pencil, ShoppingBag, Trash2 } from "lucide-react";
import EditCartItemDialog from "./EditCartItemDialog";
import QuantitySelector from "./QuantitySelector";
import { formatCurrency, getItemTotal, getItemUnitPrice } from "../utils/cart";

// Một dòng món dùng cho giỏ hàng, giỏ trượt và bước xem lại ở Checkout.
export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  compact = false,
  readOnly = false,
  horizontal = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const addons = item.addons || [];
  // Lịch sử dùng một dòng cho mỗi món: nội dung dài chỉ làm cao chính dòng đó.
  const layoutClass = horizontal
    ? "border p-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-5"
    : `border-2 shadow-[var(--shadow-sm)] ${compact ? "p-4" : "p-4 sm:p-6"}`;
  const summaryClass = horizontal
    ? "mt-3 border-t pt-3 sm:mt-0 sm:grid sm:grid-cols-[4rem_6rem] sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0"
    : "mt-4 border-t pt-4";

  return (
    <article
      className={`relative border-[var(--border-light)] bg-[var(--bg-surface)] ${layoutClass}`}
    >
      {/* Thông tin món lấy từ cùng dữ liệu đã chọn ở trang chủ hoặc menu. */}
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden bg-[var(--bg-subtle)] text-[var(--text-muted)] ${compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24"}`}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ShoppingBag size={28} aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--btn-primary-default)]">
              {item.type === "combo" ? "Combo" : "Meal"}
            </span>
            {!readOnly && (
              // Vùng bấm phủ dòng món; các nút số lượng/xóa nằm trên vùng này.
              <button
                type="button"
                aria-label={`Edit ${item.name}`}
                aria-haspopup="dialog"
                onClick={() => setIsEditing(true)}
                className="inline-flex cursor-pointer items-center gap-1 rounded px-1 py-1 text-xs font-bold text-[var(--btn-primary-default)] after:absolute after:inset-0 after:z-1 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[var(--focus-ring)]"
              >
                <Pencil size={13} aria-hidden="true" /> Edit
              </button>
            )}
          </div>
          <h3
            className={`break-words font-black leading-snug text-[var(--text-primary)] ${compact ? "text-sm" : "text-base sm:text-lg"}`}
          >
            {item.name}
          </h3>
          {item.size_name && (
            <p className="mt-1 text-xs font-medium text-[var(--text-secondary)]">
              Size: {item.size_name}
            </p>
          )}

          {/* Giữ nguyên các món thêm của từng lựa chọn, kể cả khi tăng số lượng. */}
          {addons.length > 0 && (
            <ul className={`mt-2 text-xs text-[var(--text-secondary)] ${horizontal ? "flex flex-wrap gap-1.5" : "space-y-1"}`}>
              {addons.map((addon) => (
                <li
                  key={addon.addon_id}
                  className={horizontal ? "max-w-full wrap-break-word rounded bg-[var(--bg-subtle)] px-2 py-0.5" : "break-words"}
                >
                  + {addon.addon_name} ({formatCurrency(addon.price)})
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {formatCurrency(getItemUnitPrice(item))} each
            {addons.length > 0 && " (incl. add-ons)"}
          </p>
        </div>
      </div>

      {/* Giỏ có nút nhanh; Checkout dùng popup và bản xác nhận chỉ để xem. */}
      <div className={`flex flex-wrap items-end justify-between gap-3 border-[var(--border-light)] ${summaryClass}`}>
        <div className="flex flex-wrap items-center gap-3">
          {!readOnly && onQuantityChange ? (
            <div className="relative z-2">
              <QuantitySelector
                quantity={item.quantity}
                itemName={item.name}
                onChange={(quantity) =>
                  onQuantityChange(item.cart_detail_id, quantity)
                }
              />
            </div>
          ) : (
            horizontal ? (
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Qty
                </span>
                <span className="font-bold tabular-nums">{item.quantity}</span>
              </div>
            ) : (
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                Quantity: {item.quantity}
              </span>
            )
          )}
          {!readOnly && onRemove && (
            <button
              type="button"
              aria-label={`Remove ${item.name} from cart`}
              onClick={() => onRemove(item.cart_detail_id)}
              className="relative z-2 inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-xs font-bold text-[var(--btn-primary-default)] transition-colors hover:bg-[var(--bg-badge-discount)] hover:text-[var(--btn-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <Trash2 size={15} aria-hidden="true" />
              Remove
            </button>
          )}
        </div>

        {/* Thành tiền = (giá món theo size + giá món thêm) × số lượng. */}
        <div className="ml-auto max-w-full wrap-anywhere text-right">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Item total
          </span>
          <p
            className={`font-black tabular-nums text-[var(--color-price)] ${compact ? "text-lg" : "text-xl"}`}
          >
            {formatCurrency(getItemTotal(item))}
          </p>
        </div>
      </div>

      {!readOnly && isEditing && (
        <EditCartItemDialog item={item} onClose={() => setIsEditing(false)} />
      )}
    </article>
  );
}
