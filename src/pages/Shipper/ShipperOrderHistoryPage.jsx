import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Bike,
} from "lucide-react";
import { useShipperOrderStore } from "../../store/useShipperOrderStore";
import ShipperProfileBar from "../../components/shipper/ShipperProfileBar";
import ShipperOrderCard from "../../components/shipper/ShipperOrderCard";

const STATUS_FILTER_TABS = [
  { key: "ALL", label: "All Accepted" },
  { key: "ACCEPTED", label: "ACCEPTED" },
  { key: "DELIVERING", label: "DELIVERING" },
  { key: "COMPLETED", label: "COMPLETED" },
  { key: "CANCELLED", label: "CANCELLED" },
];

const ORDERS_PER_PAGE = 2;

export default function ShipperOrderHistoryPage() {
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
  const getPendingOrders = useShipperOrderStore(
    (state) => state.getPendingOrders
  );

  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const activeShipper = getCurrentShipper();
  // Accepted orders where ORDER.delivery_id === activeShipper.account_id
  const myAcceptedOrders = getShipperOrders();
  const pendingPoolCount = getPendingOrders().length;

  const countByFilter = (filterKey) => {
    if (filterKey === "ALL") return myAcceptedOrders.length;
    return myAcceptedOrders.filter((o) => o.current_status === filterKey)
      .length;
  };

  const filteredOrders = myAcceptedOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "ALL" || order.current_status === selectedStatus;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      String(order.order_id).includes(query) ||
      order.receiver_name.toLowerCase().includes(query) ||
      order.phone_number.toLowerCase().includes(query) ||
      order.full_address.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  // Compact pagination so mobile shippers never have to scroll up and down
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * ORDERS_PER_PAGE,
    safePage * ORDERS_PER_PAGE
  );

  const handleSelectOrder = (order) => {
    navigate(`/shipper/detail/${order.order_id}`);
  };

  const handleFilterChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans pb-8">
      {/* Shipper Profile Bar */}
      <ShipperProfileBar onReset={() => setCurrentPage(1)} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 space-y-3">
        {/* Compact Header + Filter + Search in One Tight Box */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] p-3.5 shadow-[var(--shadow-sm)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Bike size={18} className="text-[var(--btn-primary-default)]" />
              <h1 className="text-base sm:text-xl font-black uppercase tracking-tight">
                @{activeShipper.username}&apos;s Accepted Orders
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--btn-primary-default)] border border-[var(--border-divider)] text-[11px] font-black">
                delivery_id #{activeShipper.account_id} ({myAcceptedOrders.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/shipper/orders")}
                className="px-3.5 py-1.5 rounded-full bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Package size={13} />
                Pending Orders ({pendingPoolCount})
              </button>
            </div>
          </div>

          {/* Filter Pills & Search Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {STATUS_FILTER_TABS.map((tab) => {
                const isActive = selectedStatus === tab.key;
                const count = countByFilter(tab.key);
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleFilterChange(tab.key)}
                    className={`px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-wider border transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                        : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search order_id, receiver_name, phone_number..."
                  className="w-full pl-8 pr-3 py-1 rounded-full bg-[var(--bg-main)] border border-[var(--border-divider)] text-xs font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:font-normal focus:outline-none focus:border-[var(--btn-primary-default)]"
                />
              </div>

              {/* Compact Inline Pager to avoid mobile scrolling */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-full bg-[var(--bg-main)] border border-[var(--border-divider)] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-black px-1.5">
                    {safePage}/{totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="w-7 h-7 rounded-full bg-[var(--bg-main)] border border-[var(--border-divider)] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Jump Order Pills (1-tap jump to any order without scrolling) */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              <span className="text-[10px] font-black uppercase text-[var(--text-muted)] shrink-0">
                Quick Open:
              </span>
              {filteredOrders.map((ord) => (
                <button
                  key={ord.order_id}
                  type="button"
                  onClick={() => handleSelectOrder(ord)}
                  className="px-2.5 py-0.5 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--btn-primary-default)] hover:text-[var(--text-inverse)] border border-[var(--border-divider)] text-[11px] font-black whitespace-nowrap transition-colors cursor-pointer"
                >
                  #{ord.order_id} • {ord.current_status} (${ord.total.toFixed(2)})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Orders Grid */}
        {paginatedOrders.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-divider)] p-8 text-center space-y-3">
            <h3 className="text-base font-black uppercase text-[var(--text-primary)]">
              No Orders Found for @{activeShipper.username} (delivery_id #
              {activeShipper.account_id})
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-4 py-1.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-divider)] font-black text-xs uppercase cursor-pointer"
              >
                Show All My Orders
              </button>
              <button
                type="button"
                onClick={() => navigate("/shipper/orders")}
                className="px-4 py-1.5 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] font-black text-xs uppercase cursor-pointer"
              >
                Pick Up PENDING Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {paginatedOrders.map((order) => (
              <ShipperOrderCard
                key={order.order_id}
                order={order}
                mode="history"
                onSelectOrder={handleSelectOrder}
                defaultExpandedItems={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
