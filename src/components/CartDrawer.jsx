import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import Dialog from "./Dialog";
import { useCartStore } from "../store/useCartStore";
import { formatCurrency, getCartItemCount, getCartSubtotal } from "../utils/cart";

export default function CartDrawer({ onClose }) {
  // Giỏ trượt và trang Cart cùng đọc/sửa store, không giữ hai bản dữ liệu riêng.
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <Dialog onClose={onClose} labelledBy="cart-drawer-title" side>
      {/* Thanh tiêu đề và nút đóng của giỏ hàng nhanh. */}
      <div className="flex items-center justify-between gap-3 bg-[var(--bg-dark)] p-5 text-[var(--text-inverse)]">
        <h2
          id="cart-drawer-title"
          className="flex items-center gap-2 text-lg font-black uppercase tracking-wider"
        >
          <ShoppingBag size={20} aria-hidden="true" className="text-[var(--btn-secondary-default)]" />
          Your food cart
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close shopping cart"
          className="rounded-full p-2 text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Dùng lại dòng món và bộ số lượng giống trang Cart để thao tác nhất quán. */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="space-y-4 py-16 text-center">
            <ShoppingBag size={40} aria-hidden="true" className="mx-auto text-[var(--text-muted)]" />
            <p className="text-sm font-bold text-[var(--text-secondary)]">
              Your shopping cart is currently empty.
            </p>
            <Link
              to="/menu"
              onClick={onClose}
              className="inline-flex rounded-full bg-[var(--btn-primary-default)] px-5 py-3 text-xs font-bold uppercase text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              Explore our menu
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.cart_detail_id}>
                <CartItem
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                  compact
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chỉ chuyển sang trang giỏ; việc xem giỏ không tạo đơn hoặc xóa món. */}
      {cart.length > 0 && (
        <div className="space-y-4 border-t border-[var(--border-divider)] bg-[var(--bg-subtle)] p-5">
          <div className="flex justify-between gap-3 text-sm font-bold text-[var(--text-secondary)]">
            <span>Food subtotal ({getCartItemCount(cart)} items)</span>
            <span aria-live="polite" className="text-[var(--color-price)]">
              {formatCurrency(getCartSubtotal(cart))}
            </span>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            View full cart <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </Dialog>
  );
}
