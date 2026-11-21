import { useState } from "react";
import {
  MapPin,
  Phone,
  User,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Utensils,
  Bike,
  Lock,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderProgressStepper from "./OrderProgressStepper";
import OrderItemsList from "./OrderItemsList";

export default function ShipperOrderCard({
  order,
  mode = "pending", // "pending" | "history"
  onAcceptOrder,
  onSelectOrder,
  defaultExpandedItems = false,
}) {
  const [showItems, setShowItems] = useState(defaultExpandedItems);

  const itemsBrief = (order.items || [])
    .map((item) => `${item.quantity}x ${item.product_name || item.combo_name}`)
    .join(" • ");

  return (
    <div
      onClick={() => {
        if (mode === "history" && onSelectOrder) {
          onSelectOrder(order);
        }
      }}
      className={`bg-[var(--bg-surface)] border-2 border-[var(--border-light)] hover:border-[var(--btn-primary-default)] transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] flex flex-col justify-between ${
        mode === "history" ? "cursor-pointer" : ""
      }`}
    >
      <div>
        {/* Compact Top Bar: Order ID + Status + delivery_id + Price */}
        <div className="bg-[var(--bg-subtle)] px-3.5 sm:px-5 py-2.5 border-b-2 border-[var(--border-divider)] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-[var(--bg-dark)] text-[var(--text-inverse)] font-black text-xs tracking-wider">
              #ORD-{order.order_id}
            </span>
            {order.current_status && (
              <OrderStatusBadge status={order.current_status} size="sm" />
            )}
            {order.delivery_id !== null && order.delivery_id !== undefined && (
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-[10px] font-black text-[var(--text-secondary)] inline-flex items-center gap-1">
                <Bike size={11} className="text-[var(--btn-primary-default)]" />
                delivery_id #{order.delivery_id}
              </span>
            )}
            {order.created_at && (
              <span className="text-[11px] font-bold text-[var(--text-muted)] hidden sm:inline-flex items-center gap-1">
                <Clock size={12} /> {order.created_at}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black text-[var(--color-price)]">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-3.5 sm:p-4 space-y-2.5">
          {mode === "history" && (
            <OrderProgressStepper
              currentStatus={order.current_status}
              statusHistory={order.status_history}
              cancelReason={order.cancel_reason}
            />
          )}

          {/* Receiver, Phone & Full Address from ORDER table */}
          <div className="bg-[var(--bg-main)] border border-[var(--border-light)] p-3 space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)]">
                <User
                  size={15}
                  className="text-[var(--btn-primary-default)] shrink-0"
                />
                <span>{order.receiver_name}</span>
              </div>

              <a
                href={`tel:${order.phone_number}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--status-success)] text-[var(--status-success)] text-xs font-black inline-flex items-center gap-1 hover:bg-[var(--status-success)] hover:text-[var(--text-inverse)] transition-colors"
              >
                <Phone size={12} />
                {order.phone_number}
              </a>
            </div>

            <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-snug">
              <MapPin
                size={15}
                className="text-[var(--btn-primary-default)] shrink-0 mt-0.5"
              />
              <span>{order.full_address}</span>
            </div>

            {order.customer_note && (
              <div className="pt-1.5 mt-1.5 border-t border-[var(--border-divider)] flex items-start gap-1.5 text-xs text-[var(--status-warning)] font-bold">
                <MessageSquare size={13} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2">{order.customer_note}</span>
              </div>
            )}
          </div>

          {/* 1-Line Food Summary + Expandable Details */}
          {order.items && order.items.length > 0 && (
            <div className="bg-[var(--bg-subtle)]/60 border border-[var(--border-light)] px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] min-w-0">
                  <Utensils
                    size={13}
                    className="text-[var(--btn-primary-default)] shrink-0"
                  />
                  <span className="truncate text-[var(--text-secondary)]">
                    {itemsBrief}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowItems(!showItems);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-[10px] font-black uppercase text-[var(--btn-primary-default)] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {showItems ? (
                    <>
                      Hide <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Items <ChevronDown size={12} />
                    </>
                  )}
                </button>
              </div>

              {showItems && (
                <div className="mt-2">
                  <OrderItemsList order={order} compact={true} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Row */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-[var(--bg-subtle)] border-t-2 border-[var(--border-divider)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
          {order.payment_name && <span>{order.payment_name}</span>}
          {order.rating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] font-black text-[var(--text-primary)]">
              <Star
                size={11}
                fill="var(--color-rating-star)"
                className="text-[var(--color-rating-star)]"
              />
              {order.rating}/5
            </span>
          )}
        </div>

        {mode === "pending" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAcceptOrder && onAcceptOrder(order);
            }}
            className="px-5 py-2.5 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider transition-all shadow-[var(--shadow-sm)] inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <CheckCircle2 size={15} />
            Accept Order
          </button>
        ) : order.current_status === "COMPLETED" ||
          order.current_status === "CANCELLED" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrder && onSelectOrder(order);
            }}
            className="px-4 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] font-black text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Lock size={13} />
            <span>View Details (Locked)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrder && onSelectOrder(order);
            }}
            className="px-5 py-2 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider transition-all shadow-[var(--shadow-sm)] inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Update Status</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
