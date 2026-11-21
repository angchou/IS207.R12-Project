import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  CheckCircle2,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { useShipperOrderStore } from "../../store/useShipperOrderStore";
import ShipperProfileBar from "../../components/shipper/ShipperProfileBar";
import ShipperOrderCard from "../../components/shipper/ShipperOrderCard";
import OrderStatusBadge from "../../components/shipper/OrderStatusBadge";
import { MOCK_PAYMENT_METHODS } from "../../data/mockData";

export default function ShipperPendingOrdersPage() {
  const navigate = useNavigate();

  // Subscribe state from store
  useShipperOrderStore((state) => state.rawOrders);
  useShipperOrderStore((state) => state.orderStatuses);
  useShipperOrderStore((state) => state.currentShipperId);

  const getCurrentShipper = useShipperOrderStore(
    (state) => state.getCurrentShipper
  );
  const getPendingOrders = useShipperOrderStore(
    (state) => state.getPendingOrders
  );
  const getShipperOrders = useShipperOrderStore(
    (state) => state.getShipperOrders
  );
  const acceptOrder = useShipperOrderStore((state) => state.acceptOrder);
  const resetDemoOrders = useShipperOrderStore(
    (state) => state.resetDemoOrders
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(0);
  const [recentlyAccepted, setRecentlyAccepted] = useState(null);

  const activeShipper = getCurrentShipper();
  const pendingOrders = getPendingOrders();
  const myOrders = getShipperOrders();

  // Filter PENDING orders by search query and PAYMENT_METHOD.payment_id
  const filteredPendingOrders = pendingOrders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(order.order_id).includes(query) ||
      order.receiver_name.toLowerCase().includes(query) ||
      order.phone_number.toLowerCase().includes(query) ||
      order.full_address.toLowerCase().includes(query);

    const matchesPayment =
      selectedPaymentId === 0 || order.payment_id === selectedPaymentId;

    return matchesQuery && matchesPayment;
  });

  // Accept order: Set ORDER.delivery_id = activeShipper.account_id and transition PENDING -> ACCEPTED
  const handleAcceptOrder = (order) => {
    acceptOrder(order.order_id);
    setRecentlyAccepted({
      order_id: order.order_id,
      receiver_name: order.receiver_name,
      total: order.total,
      delivery_id: activeShipper.account_id,
      username: activeShipper.username,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans pb-12">
      {/* Shipper Profile Bar */}
      <ShipperProfileBar onReset={() => setRecentlyAccepted(null)} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 space-y-4">
        {/* Compact Page Header */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] p-4 shadow-[var(--shadow-sm)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight">
                Pending Orders Queue
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] text-xs font-black">
                {pendingOrders.length} PENDING
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shipper/history")}
            className="px-4 py-2 rounded-full bg-[var(--btn-secondary-default)] hover:bg-[var(--btn-secondary-hover)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <ClipboardList size={15} />
            My Accepted Orders ({myOrders.length})
          </button>
        </div>

        {/* Feedback Banner after accepting an order */}
        {recentlyAccepted && (
          <div className="bg-[var(--bg-surface)] border-2 border-[var(--status-success)] border-l-8 p-3.5 shadow-[var(--shadow-md)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                size={22}
                className="text-[var(--status-success)] shrink-0"
              />
              <div className="text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-[var(--text-primary)] uppercase">
                    #ORD-{recentlyAccepted.order_id} Assigned to @
                    {recentlyAccepted.username} (delivery_id #
                    {recentlyAccepted.delivery_id})
                  </span>
                  <OrderStatusBadge status="ACCEPTED" size="sm" />
                </div>
                <p className="text-[var(--text-secondary)] font-medium mt-0.5">
                  receiver_name:{" "}
                  <strong>{recentlyAccepted.receiver_name}</strong> • total:{" "}
                  <strong>${recentlyAccepted.total.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  navigate(`/shipper/detail/${recentlyAccepted.order_id}`)
                }
                className="px-4 py-2 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Update Status</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/shipper/history")}
                className="px-3.5 py-2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-divider)] font-bold text-xs uppercase cursor-pointer"
              >
                My Queue
              </button>
            </div>
          </div>
        )}

        {/* Filter Pills (strictly from PAYMENT_METHOD table) & Search */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] p-3.5 shadow-[var(--shadow-sm)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedPaymentId(0)}
              className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${selectedPaymentId === 0
                  ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                  : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                }`}
            >
              All Payments
            </button>
            {MOCK_PAYMENT_METHODS.map((pm) => {
              const isActive = selectedPaymentId === pm.payment_id;
              return (
                <button
                  key={pm.payment_id}
                  type="button"
                  onClick={() => setSelectedPaymentId(pm.payment_id)}
                  className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${isActive
                      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                      : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                >
                  {pm.payment_name}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order_id, receiver_name, full_address..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-divider)] text-xs font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:font-normal focus:outline-none focus:border-[var(--btn-primary-default)]"
            />
          </div>
        </div>

        {/* PENDING Orders List */}
        {filteredPendingOrders.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-divider)] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] text-[var(--btn-primary-default)] flex items-center justify-center mx-auto">
              <Package size={24} />
            </div>
            <h3 className="text-base font-black uppercase text-[var(--text-primary)]">
              No PENDING Orders Found
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate("/shipper/history")}
                className="px-5 py-2 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] font-black text-xs uppercase cursor-pointer"
              >
                Go to My Accepted Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPaymentId(0);
                  resetDemoOrders();
                }}
                className="px-5 py-2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-divider)] font-black text-xs uppercase cursor-pointer"
              >
                Reset Demo Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPendingOrders.map((order) => (
              <ShipperOrderCard
                key={order.order_id}
                order={order}
                mode="pending"
                onAcceptOrder={handleAcceptOrder}
                defaultExpandedItems={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
