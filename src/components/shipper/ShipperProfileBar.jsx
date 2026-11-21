import { Bike, RotateCcw } from "lucide-react";
import { useShipperOrderStore } from "../../store/useShipperOrderStore";

export default function ShipperProfileBar({ onReset }) {
  const getCurrentShipper = useShipperOrderStore(
    (state) => state.getCurrentShipper
  );
  const getShipperOrders = useShipperOrderStore(
    (state) => state.getShipperOrders
  );
  const getPendingOrders = useShipperOrderStore(
    (state) => state.getPendingOrders
  );
  const resetDemoOrders = useShipperOrderStore(
    (state) => state.resetDemoOrders
  );

  // Subscribe to raw state changes
  useShipperOrderStore((state) => state.rawOrders);
  useShipperOrderStore((state) => state.orderStatuses);

  const activeShipper = getCurrentShipper();
  const myOrders = getShipperOrders();
  const pendingCount = getPendingOrders().length;

  const activeDeliveryCount = myOrders.filter(
    (o) =>
      o.current_status === "ACCEPTED" || o.current_status === "DELIVERING"
  ).length;
  const completedCount = myOrders.filter(
    (o) => o.current_status === "COMPLETED"
  ).length;

  const handleReset = () => {
    resetDemoOrders();
    if (onReset) onReset();
  };

  return (
    <div className="bg-[var(--bg-dark)] text-[var(--text-inverse)] border-b-2 border-[var(--btn-primary-default)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Logged-in Shipper Identity (Strictly ACCOUNT table columns: account_id, username, email, point) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] flex items-center justify-center font-black text-xs shrink-0">
            <Bike size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-xs sm:text-sm uppercase tracking-tight truncate">
                @{activeShipper.username}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--btn-secondary-default)] text-[var(--text-inverse)] text-[10px] font-black">
                account_id #{activeShipper.account_id}
              </span>
              <span className="hidden sm:inline text-[11px] text-[var(--border-light)] font-semibold">
                • {activeShipper.email} • {activeShipper.point} PTS
              </span>
            </div>
          </div>
        </div>

        {/* Personal Shift Summary & Reset Demo Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-black">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)]/10 text-[var(--border-light)]">
              Pending: {pendingCount}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--btn-secondary-default)]/20 text-[var(--btn-secondary-default)] border border-[var(--btn-secondary-default)]/40">
              Active: {activeDeliveryCount}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--status-success)]/20 text-[#81c784] border border-[var(--status-success)]/40">
              Completed: {completedCount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 px-2.5 rounded-full bg-[var(--bg-surface)]/10 hover:bg-[var(--bg-surface)]/25 text-[var(--text-inverse)] text-[10px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
            title="Reset Demo Data"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
