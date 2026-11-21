import { ArrowLeft, ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import TopHeader from "../../components/TopHeader";
import CartItem from "../../components/CartItem";
import { useCartStore } from "../../store/useCartStore";
import {
  formatCurrency,
  getCartItemCount,
  getCartSubtotal,
} from "../../utils/cart";

export default function CustomerCartPage() {
  // 1. Lấy cùng một giỏ với Home, Menu, CartDrawer và số đếm trên thanh menu.
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // 2. Tính lại số món và tiền (đã gồm món thêm) mỗi khi giỏ thay đổi.
  const itemCount = getCartItemCount(cart);
  const subtotal = getCartSubtotal(cart);

  return (
    // Navbar, ảnh nền và Footer đã có trong CustomerLayout, không tạo lại ở đây.
    <div className="min-h-[65vh] font-sans text-[var(--text-primary)] selection:bg-[var(--btn-primary-default)] selection:text-[var(--text-inverse)]">
      <TopHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* 3. Đường dẫn và tiêu đề dùng cùng kiểu chữ, màu đỏ/kem như Home. */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"
        >
          <Link
            to="/home"
            className="rounded hover:text-[var(--btn-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span
            aria-current="page"
            className="text-[var(--btn-primary-default)]"
          >
            Your cart
          </span>
        </nav>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--btn-primary-default)]">
              <ShoppingBag size={16} aria-hidden="true" /> Made for your cravings
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Your food cart
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your favorites, just the way you like them.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-divider)] bg-[var(--bg-surface)] px-5 py-3 text-xs font-bold uppercase text-[var(--text-secondary)] transition-colors hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Continue shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* 4. Giỏ chưa có món hoặc vừa xóa món cuối: hướng khách trở lại Menu. */
          <section className="border-2 border-dashed border-[var(--border-divider)] bg-[var(--bg-surface)] px-6 py-16 text-center shadow-[var(--shadow-sm)] sm:py-20">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--btn-primary-default)]">
              <ShoppingBag size={36} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              A delicious meal starts with your first pick. Explore our menu and
              find your favorites.
            </p>
            <Link
              to="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-7 py-3.5 text-xs font-black uppercase tracking-wide text-[var(--text-inverse)] transition-colors hover:bg-[var(--btn-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              Explore our menu <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* 5. Mỗi dòng tái sử dụng CartItem, cũng là component trong CartDrawer. */}
            <section
              aria-labelledby="selected-meals-title"
              className="min-w-0"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="selected-meals-title"
                  className="text-lg font-black uppercase tracking-tight"
                >
                  Your selected meals
                </h2>
                <span
                  aria-live="polite"
                  className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs font-bold text-[var(--btn-primary-default)]"
                >
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.cart_detail_id}>
                    <CartItem
                      item={item}
                      onQuantityChange={updateQuantity}
                      onRemove={removeItem}
                    />
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Tổng tiền cập nhật ngay khi tăng/giảm số lượng hoặc xóa món. */}
            <aside
              aria-labelledby="cart-summary-title"
              className="border-2 border-[var(--border-light)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] lg:sticky lg:top-24"
            >
              <div className="border-b border-[var(--border-divider)] bg-[var(--bg-subtle)] p-5">
                <h2
                  id="cart-summary-title"
                  className="flex items-center gap-2 text-lg font-black uppercase tracking-tight"
                >
                  <ShoppingBag
                    size={20}
                    aria-hidden="true"
                    className="text-[var(--btn-primary-default)]"
                  />{" "}
                  Order summary
                </h2>
              </div>
              <div className="space-y-5 p-5">
                <dl className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between gap-3">
                    <dt>Items</dt>
                    <dd className="font-bold">{itemCount}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Food subtotal</dt>
                    <dd className="font-bold">{formatCurrency(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-[var(--border-divider)] pt-4 text-lg font-black text-[var(--text-primary)]">
                    <dt>Cart total</dt>
                    <dd
                      aria-live="polite"
                      aria-atomic="true"
                      className="text-[var(--color-price)]"
                    >
                      {formatCurrency(subtotal)}
                    </dd>
                  </div>
                </dl>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  Prices include your selected sizes and add-ons.
                </p>
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-[var(--text-inverse)] transition-colors hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                >
                  Continue to checkout <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
