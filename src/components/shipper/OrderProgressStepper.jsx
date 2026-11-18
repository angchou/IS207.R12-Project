import { Check, XCircle, Clock } from "lucide-react";
import { STATUS_META, DELIVERY_STEPS } from "./shipperConstants";

export default function OrderProgressStepper({
  currentStatus = "ACCEPTED",
  statusHistory = [],
  cancelReason = null,
  showTimeline = false,
}) {
  const isCancelled = currentStatus === "CANCELLED";
  const currentStepIndex = DELIVERY_STEPS.indexOf(currentStatus);

  // Find timestamp for each status transition in ORDER_STATUS
  const getStepTimestamp = (stepCode) => {
    const matched = [...statusHistory]
      .reverse()
      .find((entry) => entry.status_name === stepCode);
    if (!matched || !matched.created_at) return null;
    const parts = matched.created_at.split(" ");
    return parts.length > 1 ? parts[1] : matched.created_at;
  };

  // Check whether a step was reached
  const hasReachedStep = (stepCode, index) => {
    if (isCancelled) {
      return statusHistory.some((entry) => entry.status_name === stepCode);
    }
    return index <= currentStepIndex;
  };

  return (
    <div className="bg-[var(--bg-main)] border border-[var(--border-light)] p-2.5 sm:p-3">
      {/* Compact 4-Step Horizontal Bar */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {DELIVERY_STEPS.map((stepCode, index) => {
          const meta = STATUS_META[stepCode];
          const StepIcon = meta.icon;
          const reached = hasReachedStep(stepCode, index);
          const isCurrent = !isCancelled && currentStatus === stepCode;
          const shortTime = getStepTimestamp(stepCode);

          let circleStyle =
            "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-divider)]";
          if (isCurrent) {
            circleStyle =
              "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border border-[var(--btn-primary-default)]";
          } else if (reached) {
            circleStyle =
              "bg-[var(--status-success)] text-[var(--text-inverse)] border border-[var(--status-success)]";
          }

          return (
            <div
              key={stepCode}
              className={`px-2 py-1.5 border transition-all flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left ${
                isCurrent
                  ? "bg-[var(--bg-surface)] border-[var(--border-active)] shadow-[var(--shadow-sm)]"
                  : reached
                    ? "bg-[var(--bg-surface)] border-[var(--border-divider)]"
                    : "bg-[var(--bg-subtle)]/40 border-[var(--border-light)] opacity-60"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${circleStyle}`}
              >
                {reached && !isCurrent ? (
                  <Check size={13} />
                ) : (
                  <StepIcon size={13} />
                )}
              </div>

              <div className="min-w-0 w-full">
                <p className="text-[10px] sm:text-[11px] font-black uppercase text-[var(--text-primary)] truncate leading-tight">
                  {meta.code}
                </p>
                {shortTime && (
                  <p className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] truncate leading-tight">
                    {shortTime}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancelled Alert Banner (only renders actual database fields) */}
      {isCancelled && (
        <div className="mt-2 p-2 bg-[var(--bg-badge-discount)] border-l-4 border-[var(--status-error)] flex items-center gap-2 text-xs">
          <XCircle size={15} className="text-[var(--status-error)] shrink-0" />
          <div className="min-w-0">
            <span className="font-black text-[var(--status-error)] uppercase mr-1.5">
              CANCELLED
              {getStepTimestamp("CANCELLED")
                ? ` (${getStepTimestamp("CANCELLED")})`
                : ""}
            </span>
            {cancelReason && (
              <span className="text-[var(--text-primary)] font-medium">
                — {cancelReason}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Chronological Timeline from ORDER_STATUS (when showTimeline is true) */}
      {showTimeline && statusHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-divider)]">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
            <Clock size={12} className="text-[var(--btn-primary-default)]" />
            ORDER_STATUS ({statusHistory.length})
          </p>
          <div className="space-y-1.5">
            {statusHistory.map((log, idx) => {
              const logMeta = STATUS_META[log.status_name] || STATUS_META.PENDING;
              const isLatest = idx === statusHistory.length - 1;
              return (
                <div
                  key={log.order_status_id}
                  className={`flex items-center justify-between px-3 py-1.5 border text-xs ${
                    isLatest
                      ? "bg-[var(--bg-surface)] border-[var(--border-active)] font-bold"
                      : "bg-[var(--bg-surface)] border-[var(--border-light)] text-[var(--text-secondary)]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${logMeta.dotClass}`}
                    />
                    <span className="font-black text-[var(--text-primary)] uppercase">
                      {log.status_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      order_status_id #{log.order_status_id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold text-[10px]">
                      {log.created_at}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
