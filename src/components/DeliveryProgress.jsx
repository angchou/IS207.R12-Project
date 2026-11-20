import { Check, Truck } from "lucide-react";
import { DELIVERY_STEPS, formatOrderDate, getLatestStatus } from "../utils/orderHistory";
import "./DeliveryProgress.css";

export default function DeliveryProgress({ order }) {
  const currentStatus = getLatestStatus(order);
  const currentIndex = DELIVERY_STEPS.findIndex(
    ({ status }) => status.status_name === currentStatus,
  );

  return (
    <section className="border border-[var(--border-light)] bg-[var(--bg-main)] p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide">
        <Truck size={18} aria-hidden="true" className="text-[var(--btn-primary-default)]" />
        Delivery progress
      </h3>

      {/* Đường liền là đoạn đã qua, chấm động là đoạn đang đi tới mốc tiếp theo. */}
      <ol className="delivery-steps">
        {DELIVERY_STEPS.map(({ status, title }, index) => {
          const event = order.status_history.findLast(
            (entry) => entry.status_name === status.status_name,
          );
          const isComplete = index < currentIndex || currentIndex === DELIVERY_STEPS.length - 1;
          const isCurrent = index === currentIndex;
          const segmentState = isComplete ? "complete" : isCurrent ? "active" : "waiting";

          return (
            <li
              key={status.status_name}
              aria-current={isCurrent ? "step" : undefined}
              className="delivery-step"
            >
              {index < DELIVERY_STEPS.length - 1 && (
                <span aria-hidden="true" className="delivery-connector" data-state={segmentState}>
                  {segmentState === "active" && (
                    <>
                      <span className="delivery-dot" />
                      <span className="delivery-dot" />
                      <span className="delivery-dot" />
                    </>
                  )}
                </span>
              )}
              <span aria-hidden="true" className="delivery-marker" data-state={segmentState}>
                {isComplete ? <Check size={16} /> : index + 1}
              </span>

              {/* Mốc hiện tại nổi bật và giữ thời gian thực tế lấy từ lịch sử trạng thái. */}
              <div className="min-w-0">
                <p className={`text-sm font-bold ${
                  isCurrent ? "text-[var(--status-success)]" : "text-[var(--text-primary)]"
                }`}>
                  {title}
                </p>
                {event ? (
                  <time dateTime={event.created_at} className="mt-1 block text-xs text-[var(--text-secondary)]">
                    {formatOrderDate(event.created_at)}
                  </time>
                ) : (
                  !isComplete && (
                    <span className="mt-1 block text-xs text-[var(--text-secondary)]">Awaiting update</span>
                  )
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
