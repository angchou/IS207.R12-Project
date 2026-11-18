import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  User,
  Mail,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Bike,
  RefreshCw,
  Star,
  Utensils,
  Clock,
  CreditCard,
  Award,
  Lock,
  Copy,
  Check,
  Navigation,
} from "lucide-react";
import { useShipperOrderStore } from "../../store/useShipperOrderStore";
import ShipperProfileBar from "../../components/shipper/ShipperProfileBar";
import OrderStatusBadge from "../../components/shipper/OrderStatusBadge";
import {
  STATUS_META,
  UPDATABLE_STATUSES,
  PRESET_CANCEL_REASONS,
  getSuggestedNextStatus,
} from "../../components/shipper/shipperConstants";
import OrderProgressStepper from "../../components/shipper/OrderProgressStepper";
import OrderItemsList from "../../components/shipper/OrderItemsList";

const DETAIL_TABS = [
  { key: "DELIVERY", label: "1. Delivery & Address", icon: MapPin },
  { key: "ITEMS", label: "2. Food Items", icon: Utensils },
  { key: "TIMELINE", label: "3. Status Log", icon: Clock },
];

export default function ShipperOrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Subscribe state from store
  useShipperOrderStore((state) => state.rawOrders);
  useShipperOrderStore((state) => state.orderStatuses);
  useShipperOrderStore((state) => state.currentShipperId);

  const getCurrentShipper = useShipperOrderStore(
    (state) => state.getCurrentShipper
  );
  const getShipperOrders = useShipperOrderStore(
    (state) => state.getShipperOrders
  );
  const updateOrderStatus = useShipperOrderStore(
    (state) => state.updateOrderStatus
  );

  const activeShipper = getCurrentShipper();
  // Accepted orders for this shipper (ORDER.delivery_id === activeShipper.account_id)
  const myAcceptedOrders = getShipperOrders();

  const [manualSelectedId, setManualSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("DELIVERY");

  const requestedId = manualSelectedId || (orderId ? Number(orderId) : null);
  const selectedOrder =
    myAcceptedOrders.find((o) => o.order_id === Number(requestedId)) ||
    myAcceptedOrders[0] ||
    null;

  // Track status selection and cancellation reason per order
  const [statusSelectionMap, setStatusSelectionMap] = useState({});
  const [cancelReasonMap, setCancelReasonMap] = useState({});
  const [updateFeedback, setUpdateFeedback] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async (address) => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const currentOrderId = selectedOrder?.order_id;
  const targetStatus =
    (currentOrderId && statusSelectionMap[currentOrderId]) ||
    getSuggestedNextStatus(selectedOrder?.current_status);

  const cancelReason =
    (currentOrderId && cancelReasonMap[currentOrderId]) ??
    (selectedOrder?.cancel_reason || "");

  const setTargetStatus = (newStatus) => {
    if (!currentOrderId) return;
    setStatusSelectionMap((prev) => ({
      ...prev,
      [currentOrderId]: newStatus,
    }));
  };

  const setCancelReason = (newReason) => {
    if (!currentOrderId) return;
    setCancelReasonMap((prev) => ({
      ...prev,
      [currentOrderId]: newReason,
    }));
  };

  // Switch between the shipper's accepted orders in 1 tap
  const handleChooseAcceptedOrder = (order) => {
    setManualSelectedId(order.order_id);
    setUpdateFeedback(null);
    navigate(`/shipper/detail/${order.order_id}`, { replace: true });
  };

  // Save new status transition to ORDER_STATUS table
  const handleConfirmStatusUpdate = (statusToApply = targetStatus) => {
    if (!selectedOrder) return;

    const finalReason =
      statusToApply === "CANCELLED" ? cancelReason.trim() || null : null;

    const previousStatus = selectedOrder.current_status;
    updateOrderStatus(selectedOrder.order_id, statusToApply, finalReason);

    setStatusSelectionMap((prev) => ({
      ...prev,
      [selectedOrder.order_id]: getSuggestedNextStatus(statusToApply),
    }));

    setUpdateFeedback({
      order_id: selectedOrder.order_id,
      old_status: previousStatus,
      new_status: statusToApply,
    });
  };

  const isOrderFinalized =
    selectedOrder?.current_status === "COMPLETED" ||
    selectedOrder?.current_status === "CANCELLED";

  const recommendedNext =
    selectedOrder?.current_status === "ACCEPTED"
      ? "DELIVERING"
      : selectedOrder?.current_status === "DELIVERING"
        ? "COMPLETED"
        : null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans pb-8">
      {/* Shipper Profile Bar */}
      <ShipperProfileBar
        onReset={() => {
          setManualSelectedId(null);
          setUpdateFeedback(null);
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 space-y-3">
        {/* Top Compact Order Switcher Strip */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] p-3 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/shipper/history")}
                className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-hero)] text-[var(--text-primary)] border border-[var(--border-divider)] font-black text-[11px] uppercase inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} />
                My List
              </button>
              <span className="text-xs font-black uppercase text-[var(--text-primary)]">
                @{activeShipper.username}&apos;s Orders (delivery_id #
                {activeShipper.account_id})
              </span>
            </div>
            <span className="text-[11px] font-bold text-[var(--text-muted)]">
              Tap order to switch
            </span>
          </div>

          {myAcceptedOrders.length === 0 ? (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                No accepted orders for @{activeShipper.username} (delivery_id #
                {activeShipper.account_id}).
              </p>
              <button
                type="button"
                onClick={() => navigate("/shipper/orders")}
                className="px-4 py-1.5 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] font-black text-xs uppercase cursor-pointer"
              >
                Pick Up PENDING Orders
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {myAcceptedOrders.map((item) => {
                const isSelected = selectedOrder?.order_id === item.order_id;
                return (
                  <button
                    key={item.order_id}
                    type="button"
                    onClick={() => handleChooseAcceptedOrder(item)}
                    className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)] shadow-[var(--shadow-sm)]"
                        : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    <span>#ORD-{item.order_id}</span>
                    {item.current_status && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${
                          isSelected
                            ? "bg-[var(--bg-surface)] text-[var(--btn-primary-default)]"
                            : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {item.current_status}
                      </span>
                    )}
                    <span>${item.total.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Order Cockpit */}
        {selectedOrder && (
          <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] shadow-[var(--shadow-md)]">
            {/* Compact Feedback Banner after status change */}
            {updateFeedback && (
              <div className="bg-[var(--bg-subtle)] border-b-2 border-[var(--status-success)] px-4 py-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-[var(--status-success)] shrink-0"
                  />
                  <span className="font-bold text-[var(--text-primary)]">
                    Updated <strong>#ORD-{updateFeedback.order_id}</strong>:{" "}
                    {updateFeedback.old_status} →{" "}
                    <strong className="text-[var(--status-success)]">
                      {updateFeedback.new_status}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)]">
                  Saved to ORDER_STATUS
                </span>
              </div>
            )}

            {/* 1. Order Summary Header Bar */}
            <div className="bg-[var(--bg-subtle)] px-4 py-3 border-b-2 border-[var(--border-divider)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-[var(--bg-dark)] text-[var(--text-inverse)] font-black text-sm">
                  #ORD-{selectedOrder.order_id}
                </span>
                {selectedOrder.current_status && (
                  <OrderStatusBadge
                    status={selectedOrder.current_status}
                    size="sm"
                  />
                )}
                {selectedOrder.delivery_id !== null && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-[11px] font-black text-[var(--text-secondary)] inline-flex items-center gap-1">
                    <Bike
                      size={12}
                      className="text-[var(--btn-primary-default)]"
                    />
                    delivery_id #{selectedOrder.delivery_id}
                    {selectedOrder.shipper_username
                      ? ` (@${selectedOrder.shipper_username})`
                      : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {selectedOrder.payment_name && (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-divider)]">
                    {selectedOrder.payment_name}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black text-[var(--color-price)]">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 2. Status Update Action Panel + Progress Stepper */}
            <div className="p-3.5 sm:p-5 border-b-2 border-[var(--border-divider)] space-y-3 bg-[var(--bg-surface)]">
              <OrderProgressStepper
                currentStatus={selectedOrder.current_status}
                statusHistory={selectedOrder.status_history}
                cancelReason={selectedOrder.cancel_reason}
                showTimeline={false}
              />

              {/* Fast Status Update Controls (Locked if order is COMPLETED or CANCELLED) */}
              {isOrderFinalized ? (
                <div
                  className={`p-3.5 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    selectedOrder.current_status === "COMPLETED"
                      ? "bg-[var(--bg-main)] border-[var(--status-success)]"
                      : "bg-[var(--bg-badge-discount)] border-[var(--status-error)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[var(--text-inverse)] ${
                        selectedOrder.current_status === "COMPLETED"
                          ? "bg-[var(--status-success)]"
                          : "bg-[var(--status-error)]"
                      }`}
                    >
                      <Lock size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase text-[var(--text-primary)] block">
                        Status Locked • Order is {selectedOrder.current_status}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                        Orders in{" "}
                        <strong>{selectedOrder.current_status}</strong> status
                        cannot be modified.
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-[10px] font-black uppercase text-[var(--text-muted)] self-start sm:self-center shrink-0">
                    Locked
                  </span>
                </div>
              ) : (
                <div className="bg-[var(--bg-main)] border border-[var(--border-divider)] p-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                      <RefreshCw
                        size={14}
                        className="text-[var(--btn-primary-default)]"
                      />
                      Update Order Status:
                    </span>

                    {recommendedNext && (
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmStatusUpdate(recommendedNext)
                        }
                        className="px-4 py-1.5 rounded-full bg-[var(--status-success)] hover:bg-[var(--btn-accent-hover)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider shadow-[var(--shadow-sm)] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        1-Tap Advance to {recommendedNext}
                      </button>
                    )}
                  </div>

                  {/* 4 Status Pill Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {UPDATABLE_STATUSES.map((statusCode) => {
                      const meta = STATUS_META[statusCode];
                      const StatusIcon = meta.icon;
                      const isSelected = targetStatus === statusCode;
                      const isCurrent =
                        selectedOrder.current_status === statusCode;

                      return (
                        <button
                          key={statusCode}
                          type="button"
                          onClick={() => setTargetStatus(statusCode)}
                          className={`px-3 py-2 rounded-full border-2 text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                              : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                          }`}
                        >
                          <StatusIcon size={13} className="shrink-0" />
                          <span>{meta.code}</span>
                          {isCurrent && (
                            <span className="text-[9px] opacity-80">• Now</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Cancel Reason Box (ORDER.cancel_reason) */}
                  {targetStatus === "CANCELLED" && (
                    <div className="p-2.5 bg-[var(--bg-badge-discount)] border border-[var(--status-error)] space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[var(--status-error)]">
                        <AlertTriangle size={13} />
                        ORDER.cancel_reason:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_CANCEL_REASONS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setCancelReason(preset)}
                            className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-[10px] font-bold text-[var(--text-primary)] cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Enter cancel_reason..."
                        className="w-full px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--status-error)]"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">
                      Target:{" "}
                      <strong className="text-[var(--btn-primary-default)]">
                        {targetStatus}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleConfirmStatusUpdate(targetStatus)}
                      className="px-6 py-2 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider shadow-[var(--shadow-sm)] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      Save Status ({targetStatus})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Sub-Tab Navigation */}
            <div className="px-3.5 sm:px-5 pt-3 bg-[var(--bg-subtle)]/50 border-b border-[var(--border-divider)] flex items-center gap-2 overflow-x-auto pb-2.5">
              {DETAIL_TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.key;
                const countSuffix =
                  tab.key === "ITEMS"
                    ? ` (${selectedOrder.items.length})`
                    : tab.key === "TIMELINE"
                      ? ` (${selectedOrder.status_history.length})`
                      : "";
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[var(--bg-dark)] text-[var(--text-inverse)] border-[var(--bg-dark)]"
                        : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    <TabIcon size={13} />
                    <span>
                      {tab.label}
                      {countSuffix}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4. In-Place Sub-Tab Content Panel */}
            <div className="p-3.5 sm:p-5">
              {activeTab === "DELIVERY" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Customer & Address Box */}
                  <div className="p-3.5 bg-[var(--bg-main)] border border-[var(--border-light)] space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User
                          size={16}
                          className="text-[var(--btn-primary-default)] shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                            receiver_name (account_id #{selectedOrder.account_id})
                          </span>
                          <span className="text-sm font-black text-[var(--text-primary)]">
                            {selectedOrder.receiver_name}
                            {selectedOrder.customer_username
                              ? ` (@${selectedOrder.customer_username})`
                              : ""}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${selectedOrder.phone_number}`}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--status-success)] text-[var(--text-inverse)] text-xs font-black inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)]"
                      >
                        <Phone size={13} />
                        {selectedOrder.phone_number}
                      </a>
                    </div>

                    <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-divider)] space-y-2.5">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={16}
                          className="text-[var(--btn-primary-default)] shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                            full_address
                          </span>
                          <span className="text-xs sm:text-sm font-black text-[var(--text-primary)] break-words">
                            {selectedOrder.full_address}
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions: Copy Address, Google Maps & Apple Maps */}
                      <div className="pt-2 border-t border-[var(--border-light)] flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyAddress(selectedOrder.full_address)
                          }
                          className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase inline-flex items-center gap-1 transition-all cursor-pointer ${
                            copiedAddress
                              ? "bg-[var(--status-success)] text-[var(--text-inverse)] border-[var(--status-success)]"
                              : "bg-[var(--bg-main)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-divider)]"
                          }`}
                        >
                          {copiedAddress ? (
                            <>
                              <Check size={12} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copy Address
                            </>
                          )}
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            selectedOrder.full_address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] text-[11px] font-black uppercase inline-flex items-center gap-1 transition-all shadow-[var(--shadow-sm)]"
                        >
                          <Navigation size={12} />
                          Google Maps
                        </a>

                        <a
                          href={`https://maps.apple.com/?q=${encodeURIComponent(
                            selectedOrder.full_address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--text-secondary)] text-[var(--text-inverse)] text-[11px] font-black uppercase inline-flex items-center gap-1 transition-all shadow-[var(--shadow-sm)]"
                        >
                          <MapPin size={12} />
                          Apple Maps
                        </a>
                      </div>
                    </div>

                    {selectedOrder.customer_email && (
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-semibold">
                        <Mail size={14} />
                        <span>{selectedOrder.customer_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Note & Payment Summary Box */}
                  <div className="p-3.5 bg-[var(--bg-main)] border border-[var(--border-light)] flex flex-col justify-between space-y-2.5">
                    {selectedOrder.customer_note && (
                      <div className="p-2.5 bg-[var(--bg-hero)] border-l-4 border-[var(--btn-secondary-default)] flex items-start gap-2">
                        <MessageSquare
                          size={15}
                          className="text-[var(--status-warning)] shrink-0 mt-0.5"
                        />
                        <div className="text-xs">
                          <span className="text-[10px] font-black uppercase text-[var(--status-warning)] block">
                            customer_note:
                          </span>
                          <span className="font-bold text-[var(--text-primary)]">
                            {selectedOrder.customer_note}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selectedOrder.payment_name && (
                        <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-light)]">
                          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] flex items-center gap-1">
                            <CreditCard size={12} /> payment_name
                          </span>
                          <span className="font-black text-[var(--text-primary)] block mt-0.5 truncate">
                            {selectedOrder.payment_name}
                          </span>
                        </div>
                      )}

                      <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-light)]">
                        <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] flex items-center gap-1">
                          <Award size={12} /> earned_point / used_point
                        </span>
                        <span className="font-black text-[var(--status-success)] block mt-0.5">
                          +{selectedOrder.earned_point} / -
                          {selectedOrder.used_point}
                        </span>
                      </div>
                    </div>

                    {selectedOrder.rating > 0 && (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="font-bold text-[var(--text-secondary)]">
                          rating:
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-divider)] inline-flex items-center gap-1 font-black">
                          <Star
                            size={12}
                            fill="var(--color-rating-star)"
                            className="text-[var(--color-rating-star)]"
                          />
                          {selectedOrder.rating} / 5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ITEMS" && (
                <OrderItemsList order={selectedOrder} compact={false} />
              )}

              {activeTab === "TIMELINE" && (
                <OrderProgressStepper
                  currentStatus={selectedOrder.current_status}
                  statusHistory={selectedOrder.status_history}
                  cancelReason={selectedOrder.cancel_reason}
                  showTimeline={true}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
