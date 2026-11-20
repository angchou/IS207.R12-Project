import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "../../components/CartItem";
import CheckoutField from "../../components/CheckoutField";
import CheckoutSection from "../../components/CheckoutSection";
import TopHeader from "../../components/TopHeader";
import { MOCK_ACCOUNT } from "../../data/mockData";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useOrderStore } from "../../store/useOrderStore";
import {
  formatCurrency,
  getCartItemCount,
  getCartSubtotal,
} from "../../utils/cart";
import { DEMO_PAYMENT_METHOD } from "../../utils/demoCheckout";

const actionStyle =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-6 py-3.5 text-xs font-black uppercase tracking-wide text-[var(--text-inverse)] transition-colors hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";
const linkStyle =
  "rounded font-bold hover:text-[var(--btn-primary-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function CustomerCheckoutPage() {
  // 1. Đọc giỏ mà Home, Menu và Cart đang dùng. Địa chỉ mẫu giúp thử demo ngay.
  const cart = useCartStore((state) => state.cart);
  const placeDemoOrder = useOrderStore((state) => state.placeDemoOrder);
  const accountId =
    useAuthStore((state) => state.user?.account_id) ?? MOCK_ACCOUNT.account_id;
  const demoAddress = MOCK_ACCOUNT.shipping_info;
  const [receipt, setReceipt] = useState(null);
  const [formError, setFormError] = useState("");
  const confirmationHeading = useRef(null);

  // Sau khi đặt đơn, di chuyển điểm đọc đến thông báo xác nhận.
  useEffect(() => {
    if (receipt) confirmationHeading.current?.focus();
  }, [receipt]);

  // 2. Xem lại cùng một danh sách và cách tính tiền như ở trang Cart.
  // Sau khi giỏ được xóa, phần tóm tắt dùng bản chụp của đơn vừa xác nhận.
  const items = receipt ? receipt.details : cart;
  const itemCount = getCartItemCount(items);
  const total = receipt ? receipt.total : getCartSubtotal(items);

  // 3. Kiểm tra thông tin, lưu đơn vào lịch sử rồi mới làm trống giỏ.
  const handleSubmit = (event) => {
    event.preventDefault();
    const { cart: currentCart, clearCart } = useCartStore.getState();

    // Đọc giỏ mới nhất để hai lần bấm liên tiếp không tạo hai đơn.
    if (currentCart.length === 0) return;

    const shipping = Object.fromEntries(new FormData(event.currentTarget));

    let demoOrder;
    try {
      demoOrder = placeDemoOrder(currentCart, shipping, accountId);
    } catch (error) {
      setFormError(error.message);
      return;
    }

    setFormError("");
    setReceipt(demoOrder);
    clearCart();
  };

  return (
    // Phần navbar, nền và footer đã có sẵn trong CustomerLayout.
    <div className="min-h-[65vh] font-sans text-[var(--text-primary)] selection:bg-[var(--btn-primary-default)] selection:text-[var(--text-inverse)]">
      <TopHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* 4. Dùng tiêu đề và đường dẫn cùng kiểu với trang giỏ hàng. */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
          <Link to="/home" className={linkStyle}>Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/cart" className={linkStyle}>Your cart</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-[var(--btn-primary-default)]">Checkout</span>
        </nav>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--border-divider)] pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Checkout</h1>
          {!receipt && cart.length > 0 && (
            <Link to="/cart" className={`${linkStyle} inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]`}>
              <ArrowLeft size={16} aria-hidden="true" /> Back to cart
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          /* 5. Nếu mở thẳng Checkout khi giỏ trống, đưa khách về Menu để chọn món. */
          <section className="border-2 border-dashed border-[var(--border-divider)] bg-[var(--bg-surface)] px-6 py-14 text-center shadow-[var(--shadow-sm)]">
            <ShoppingBag size={36} aria-hidden="true" className="mx-auto mb-4 text-[var(--btn-primary-default)]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Your cart is empty</h2>
            <p className="mb-6 mt-2 text-sm text-[var(--text-secondary)]">
              Add a meal before checking out.
            </p>
            <Link to="/menu" className={actionStyle}>
              Explore our menu <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            {receipt ? (
              /* 6. Giữ lại mã, thông tin giao hàng và tổng tiền để xem lại đơn demo. */
              <section className="border-2 border-[var(--border-light)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <CheckCircle2 size={36} aria-hidden="true" className="mb-4 text-[var(--status-success)]" />
                <h2
                  ref={confirmationHeading}
                  tabIndex={-1}
                  className="scroll-mt-24 text-2xl font-black uppercase tracking-tight focus:outline-none"
                >
                  Demo order placed
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Order #{receipt.order_id} was confirmed. No money was charged.
                </p>
                <dl className="my-6 space-y-4 border-y border-[var(--border-divider)] py-5 text-sm">
                  <div>
                    <dt className="font-bold">Recipient</dt>
                    <dd className="mt-1 wrap-break-word text-[var(--text-secondary)]">
                      {receipt.receiver_name} · {receipt.phone_number}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Delivery address</dt>
                    <dd className="mt-1 wrap-break-word text-[var(--text-secondary)]">{receipt.full_address}</dd>
                  </div>
                  {receipt.customer_note && (
                    <div>
                      <dt className="font-bold">Order note</dt>
                      <dd className="mt-1 whitespace-pre-wrap wrap-break-word text-[var(--text-secondary)]">
                        {receipt.customer_note}
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="flex flex-wrap items-center gap-4">
                  <Link to="/history" className={actionStyle}>
                    View order history <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link to="/home" className={`${linkStyle} text-sm text-[var(--text-secondary)]`}>
                    Back to home
                  </Link>
                </div>
              </section>
            ) : (
              /* 7. Các ô thông tin khớp SHIPPING_INFO; có thể sửa dữ liệu mẫu trước khi thử. */
              <form id="demo-checkout" onSubmit={handleSubmit} className="space-y-6">
                <CheckoutSection title="Delivery details" icon={MapPin}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CheckoutField
                      name="receiver_name"
                      label="Recipient name"
                      autoComplete="name"
                      defaultValue={demoAddress.receiver_name}
                      maxLength={255}
                      required
                    />
                    <CheckoutField
                      name="phone_number"
                      label="Phone number"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      defaultValue={demoAddress.phone_number}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Enter exactly 10 digits"
                      required
                    />
                    <CheckoutField
                      name="city"
                      label="City"
                      autoComplete="address-level1"
                      defaultValue={demoAddress.city}
                      maxLength={255}
                      required
                    />
                    <CheckoutField
                      name="district"
                      label="District"
                      autoComplete="address-level2"
                      defaultValue={demoAddress.district}
                      maxLength={255}
                      required
                    />
                    <div className="space-y-4 sm:col-span-2">
                      <CheckoutField
                        name="address"
                        label="Street address"
                        autoComplete="street-address"
                        defaultValue={demoAddress.address}
                        maxLength={255}
                        required
                      />
                      <CheckoutField
                        name="customer_note"
                        label="Order note (optional)"
                        multiline
                        rows={2}
                        maxLength={255}
                        placeholder="Door number or delivery instructions"
                      />
                    </div>
                  </div>
                </CheckoutSection>

                {/* Phương thức được cố định ở Demo, không thu thập thông tin thẻ. */}
                <CheckoutSection title="Payment method" icon={CreditCard}>
                  <div className="flex items-start gap-3 border border-[var(--border-divider)] bg-[var(--bg-main)] p-4">
                    <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--status-success)]" />
                    <div>
                      <p className="font-bold">{DEMO_PAYMENT_METHOD.payment_name}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Simulate a payment without entering card details or sending money.
                      </p>
                    </div>
                  </div>
                </CheckoutSection>

              </form>
            )}

            {/* 8. Bấm món để sửa trước khi đặt. Bản xác nhận sau đó chỉ để xem. */}
            <CheckoutSection title="Order summary" icon={ShoppingBag}>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.order_detail_id ?? item.cart_detail_id}>
                    <CartItem item={item} compact readOnly={Boolean(receipt)} />
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-[var(--border-divider)] pt-4 text-sm">
                <div className="flex justify-between gap-3 text-[var(--text-secondary)]">
                  <dt>Items</dt>
                  <dd className="font-bold">{itemCount}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 text-lg font-black">
                  <dt>Demo total</dt>
                  <dd aria-live="polite" className="text-[var(--color-price)]">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>

              {/* Nút ở bên dưới tóm tắt nhưng vẫn gửi form và kiểm tra các ô bắt buộc. */}
              {formError && (
                <p
                  role="alert"
                  className="mt-4 border border-[var(--status-error)] bg-[var(--bg-badge-discount)] p-4 text-sm font-bold text-[var(--status-error)]"
                >
                  {formError}
                </p>
              )}
              {!receipt && (
                <button
                  type="submit"
                  form="demo-checkout"
                  className={`${actionStyle} mt-6 w-full cursor-pointer`}
                >
                  Place demo order <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </CheckoutSection>
          </div>
        )}
      </div>
    </div>
  );
}
