import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutField from "../../components/CheckoutField";
import Dialog from "../../components/Dialog";
import OrderHistoryCard from "../../components/OrderHistoryCard";
import TopHeader from "../../components/TopHeader";
import { MOCK_ACCOUNT } from "../../data/mockData";
import { MOCK_DELIVERING_ORDER } from "../../data/mockOrders";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrderStore } from "../../store/useOrderStore";
import { belongsToAccount } from "../../utils/orderHistory";

export default function CustomerOrderHistoryPage() {
  // 1. Lấy các đơn của tài khoản hiện tại; khách demo dùng cùng mã như Checkout.
  const accountId =
    useAuthStore((state) => state.user?.account_id) ?? MOCK_ACCOUNT.account_id;
  const orders = useOrderStore((state) => state.orders);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);
  const accountOrders = orders.filter((order) => belongsToAccount(order, accountId));
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const feedbackRef = useRef(null);

  // Sau khi nút hủy biến mất, đưa con trỏ đến kết quả để tiếp tục dùng bàn phím.
  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  // 2. Nhấn hủy mở hộp xác nhận. Bấm Keep order thì đơn vẫn giữ nguyên.
  const requestCancel = (orderId) => {
    setFeedback(null);
    setCancelOrderId(orderId);
  };

  const confirmCancel = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cancelled = cancelOrder(cancelOrderId, accountId, String(form.get("cancel_reason") ?? ""));
    setFeedback({
      success: cancelled,
      message: cancelled
        ? `Order #${cancelOrderId} was cancelled.`
        : "Only pending orders can be cancelled.",
    });
    setCancelOrderId(null);
  };

  return (
    // Thanh điều hướng, ảnh nền và footer đã có trong CustomerLayout.
    <div className="min-h-[65vh] font-sans text-[var(--text-primary)] selection:bg-[var(--btn-primary-default)] selection:text-[var(--text-inverse)]">
      <TopHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* 3. Dùng tiêu đề và đường dẫn cùng kiểu với Cart và Checkout. */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
          <Link
            to="/home"
            className="rounded hover:text-[var(--btn-primary-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-[var(--btn-primary-default)]">Order history</span>
        </nav>

        <h1 className="mb-6 border-b-2 border-[var(--border-divider)] pb-5 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Order history
        </h1>

        {feedback && (
          <p
            ref={feedbackRef}
            tabIndex={-1}
            role={feedback.success ? "status" : "alert"}
            className={`mb-4 scroll-mt-24 border border-[var(--border-light)] bg-[var(--bg-surface)] p-4 text-sm font-bold focus:outline-none ${
              feedback.success ? "text-[var(--status-success)]" : "text-[var(--status-error)]"
            }`}
          >
            {feedback.message}
          </p>
        )}

        {/* 4. Đơn vừa đặt nằm đầu danh sách. Đơn mẫu được để riêng để thử timeline. */}
        <section aria-label="Your demo orders">
          {accountOrders.length > 0 ? (
            <ul className="space-y-4">
              {accountOrders.map((order) => (
                <li key={order.order_id}>
                  <OrderHistoryCard order={order} onRequestCancel={requestCancel} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-2 border-dashed border-[var(--border-divider)] bg-[var(--bg-surface)] p-8 text-center">
              <ClipboardList size={28} aria-hidden="true" className="mx-auto mb-3 text-[var(--btn-primary-default)]" />
              <h2 className="text-xl font-black">You have no orders yet</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Orders placed through demo checkout will appear here.
              </p>
              <Link
                to="/menu"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-5 py-3 text-xs font-black uppercase tracking-wide text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                Explore our menu <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        <div className="mt-8">
          <OrderHistoryCard order={MOCK_DELIVERING_ORDER} />
        </div>
      </div>

      {/* 5. Hộp xác nhận dùng chung Dialog; lý do hủy là tùy chọn. */}
      {cancelOrderId !== null && (
        <Dialog onClose={() => setCancelOrderId(null)} labelledBy="cancel-order-title">
          <form onSubmit={confirmCancel} className="space-y-4 overflow-y-auto p-5 sm:p-6">
            <div>
              <h2 id="cancel-order-title" className="text-xl font-black">Cancel order #{cancelOrderId}?</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">The order will stay in your history as cancelled.</p>
            </div>
            <CheckoutField name="cancel_reason" label="Reason (optional)" multiline rows={3} maxLength={255} />
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelOrderId(null)}
                className="rounded-full border border-[var(--border-divider)] px-4 py-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                Keep order
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--btn-primary-default)] px-4 py-3 text-xs font-black text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                Confirm cancellation
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
