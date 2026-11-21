import { ChevronDown } from "lucide-react";
import CartItem from "./CartItem";
import DeliveryProgress from "./DeliveryProgress";
import { formatCurrency, getCartItemCount } from "../utils/cart";
import { formatOrderDate, getLatestStatus, ORDER_STATUS } from "../utils/orderHistory";

const statusColors = {
  PENDING: "bg-[var(--bg-subtle)] text-[var(--status-warning)]",
  PREPARING: "bg-[var(--bg-subtle)] text-[var(--text-secondary)]",
  DELIVERING: "bg-[var(--bg-main)] text-[var(--status-info)]",
  DELIVERED: "bg-[var(--bg-main)] text-[var(--status-success)]",
  CANCELLED: "bg-[var(--bg-badge-discount)] text-[var(--status-error)]",
};

// Dùng chung một thẻ cho đơn từ Checkout và đơn ví dụ đang giao.
export default function OrderHistoryCard({ order, onRequestCancel }) {
  const status = getLatestStatus(order);
  const placedAt = order.status_history[0]?.created_at;
  const itemCount = getCartItemCount(order.details);
  const canCancel = status === ORDER_STATUS.PENDING.status_name && Boolean(onRequestCancel);

  return (
    <article className="border-2 border-[var(--border-light)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm)]">
      {/* Phần tóm tắt gồm mã đơn, ngày đặt, trạng thái và tổng tiền. */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-divider)] bg-[var(--bg-subtle)] p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-black tracking-tight">Order #{order.order_id}</h2>
          {placedAt && (
            <time dateTime={placedAt} className="mt-1 block text-xs text-[var(--text-secondary)]">
              {formatOrderDate(placedAt)}
            </time>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {order.is_sample && (
            <span className="rounded-full border border-[var(--border-divider)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
              Sample order
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[status] ?? ""}`}>
            {ORDER_STATUS[status]?.label ?? "Status unavailable"}
          </span>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        {status === ORDER_STATUS.DELIVERING.status_name && <DeliveryProgress order={order} />}
        {status === ORDER_STATUS.CANCELLED.status_name && order.cancel_reason && (
          <p className="wrap-break-word text-sm text-[var(--text-secondary)]">
            <span className="font-bold">Cancellation reason:</span> {order.cancel_reason}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
            <span aria-hidden="true"> · </span>
            <span className="font-black tabular-nums text-[var(--color-price)]">{formatCurrency(order.total)}</span>
          </p>

          {/* Chỉ hiện hành động hủy cho đơn đang PENDING. Store cũng kiểm tra lại. */}
          {canCancel && (
            <button
              type="button"
              aria-label={`Cancel order #${order.order_id}`}
              onClick={() => onRequestCancel(order.order_id)}
              className="rounded-full border border-[var(--border-active)] px-4 py-2 text-xs font-bold text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Cancel order
            </button>
          )}
        </div>

        {/* Mỗi món chiếm một dòng; các cột số lượng và giá luôn thẳng hàng. */}
        <details className="group border-t border-[var(--border-light)] pt-3">
          <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] [&::-webkit-details-marker]:hidden">
            <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
            View ordered items
          </summary>
          <ul className="mt-3 space-y-2">
            {order.details.map((item) => (
              <li key={item.order_detail_id}>
                <CartItem item={item} compact readOnly horizontal />
              </li>
            ))}
          </ul>
        </details>
      </div>
    </article>
  );
}
