import { useState, useMemo } from "react";
import {
  Search,
  Star,
  Eye,
  X,
  MapPin,
  Phone,
  CreditCard,
  Award,
  Truck,
  FileText,
} from "lucide-react";

// Cấu hình màu sắc cho từng trạng thái đơn hàng
const STATUS_STYLE = {
  Completed:
    "bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30",
  Delivering:
    "bg-[var(--status-info)]/15 text-[var(--status-info)] border-[var(--status-info)]/30",
  Preparing:
    "bg-[var(--btn-secondary-default)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30",
  Pending:
    "bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30",
  Canceled:
    "bg-[var(--status-error)]/15 text-[var(--status-error)] border-[var(--status-error)]/30",
};

const STATUS_TABS = [
  "All",
  "Completed",
  "Delivering",
  "Preparing",
  "Pending",
  "Canceled",
];

// Bảng danh sách đơn hàng gần đây kèm bộ lọc, tìm kiếm và Modal xem chi tiết đơn
export default function AdminRecentOrdersTable({ orders }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Lọc đơn hàng theo trạng thái và từ khóa (mã đơn, người nhận, số điện thoại)
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "All" || order.status_name === statusFilter;
      const matchQuery =
        order.order_code.toLowerCase().includes(q) ||
        order.receiver_name.toLowerCase().includes(q) ||
        order.phone_number.includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* Thanh tiêu đề, bộ lọc trạng thái và tìm kiếm */}
      <div className="p-6 border-b-2 border-[var(--border-divider)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black uppercase text-[var(--text-primary)]">
              Recent Store Orders
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Monitor live customer orders, payment methods, delivery progress,
              and ratings.
            </p>
          </div>

          {/* Ô tìm kiếm đơn hàng */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, customer, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
            />
          </div>
        </div>

        {/* Các nút lọc trạng thái bo 50% */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                    : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng dữ liệu đơn hàng */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer & Delivery</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-light)] text-sm">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.order_id}
                  className="hover:bg-[var(--bg-main)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-black text-[var(--btn-primary-default)] block">
                      {order.order_code}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {order.created_at}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-[var(--text-primary)]">
                      {order.receiver_name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {order.phone_number} •{" "}
                      {order.shipper_name || "Unassigned"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)]">
                    {order.payment_name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-black text-[var(--color-price)]">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-[var(--status-success)] font-bold">
                      +{order.earned_point} pts
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {order.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[var(--text-primary)]">
                        <Star
                          size={14}
                          className="text-[var(--color-rating-star)] fill-[var(--color-rating-star)]"
                        />
                        {order.rating}.0
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">
                        —
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                        STATUS_STYLE[order.status_name] ||
                        STATUS_STYLE.Pending
                      }`}
                    >
                      {order.status_name}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-xs font-medium text-[var(--text-muted)]"
                >
                  No orders match your current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xem chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] w-full max-w-lg border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
            <div className="px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
                  Order Summary
                </span>
                <h3 className="text-lg font-black">{selectedOrder.order_code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-[var(--bg-surface)]/10 text-[var(--bg-hero)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
                <span className="text-xs font-bold uppercase text-[var(--text-muted)]">
                  Placed on {selectedOrder.created_at}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    STATUS_STYLE[selectedOrder.status_name]
                  }`}
                >
                  {selectedOrder.status_name}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--btn-primary-default)]" />
                  <strong className="text-[var(--text-primary)]">
                    {selectedOrder.receiver_name}
                  </strong>{" "}
                  ({selectedOrder.phone_number})
                </p>
                <p className="flex items-start gap-2">
                  <MapPin
                    size={14}
                    className="text-[var(--btn-primary-default)] shrink-0 mt-0.5"
                  />
                  <span>{selectedOrder.full_address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard
                    size={14}
                    className="text-[var(--btn-secondary-default)]"
                  />
                  <span>Payment: {selectedOrder.payment_name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} className="text-[var(--status-info)]" />
                  <span>
                    Delivery Staff: {selectedOrder.shipper_name || "Pending assignment"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Award size={14} className="text-[var(--status-success)]" />
                  <span>
                    Loyalty Points: +{selectedOrder.earned_point} earned /{" "}
                    {selectedOrder.used_point} redeemed
                  </span>
                </p>
                {selectedOrder.customer_note && (
                  <p className="flex items-start gap-2 bg-[var(--bg-main)] p-3 border border-[var(--border-light)]">
                    <FileText size={14} className="shrink-0 mt-0.5" />
                    <span>Note: {selectedOrder.customer_note}</span>
                  </p>
                )}
                {selectedOrder.cancel_reason && (
                  <p className="p-3 bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)] border border-[var(--border-active)]/30 font-semibold">
                    Cancellation Reason: {selectedOrder.cancel_reason}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t-2 border-[var(--border-divider)] flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[var(--text-secondary)]">
                  Order Total
                </span>
                <span className="text-2xl font-black text-[var(--color-price)]">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
