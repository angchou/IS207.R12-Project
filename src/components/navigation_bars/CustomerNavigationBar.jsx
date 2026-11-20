import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  ShoppingCart,
  User,
  X,
  Flame,
  ChevronDown,
} from "lucide-react";
import { MOCK_CATEGORIES } from "../../data/mockData";
import { useCartStore } from "../../store/useCartStore";
import { getCartItemCount } from "../../utils/cart";

export default function CustomerNavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Đường dẫn và số món luôn cập nhật khi chuyển trang hoặc sửa giỏ hàng.
  const { pathname: currentPath } = useLocation();
  const cart = useCartStore((state) => state.cart);
  const itemCount = getCartItemCount(cart);

  const getDesktopLinkStyle = (path) => {
    const isActive =
      currentPath === path || (path !== "/" && currentPath.startsWith(path));
    return isActive
      ? "text-[var(--btn-primary-default)] font-bold border-b-2 border-[var(--btn-primary-default)] h-full flex items-center"
      : "text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] font-semibold h-full flex items-center transition-colors";
  };

  const getMobileLinkStyle = (path) => {
    const isActive =
      currentPath === path || (path !== "/" && currentPath.startsWith(path));
    return isActive
      ? "text-[var(--btn-primary-default)] font-bold block px-3 py-3 bg-[var(--bg-subtle)] rounded-full"
      : "text-[var(--text-secondary)] font-semibold block px-3 py-3 hover:bg-[var(--bg-main)] rounded-full transition-colors";
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] border-b border-[var(--border-light)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          <Link onClick={() => setIsMobileMenuOpen(false)}
            to="/home"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-[var(--bg-subtle)] rounded-full group-hover:bg-[var(--bg-main)] transition-colors">
              <Flame size={28} className="text-[var(--btn-primary-default)]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[var(--text-primary)]">
              Ditme
              <span className="text-[var(--btn-primary-default)]">UIT</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/home" className={getDesktopLinkStyle("/home")}>
              Home
            </Link>

            <div className="relative group h-full flex items-center">
              <Link onClick={() => setIsMobileMenuOpen(false)}
                to="/menu"
                className={`${getDesktopLinkStyle("/menu")} gap-1`}
              >
                Menu{" "}
                <ChevronDown
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </Link>

              <div className="absolute top-full left-0 w-56 bg-[var(--bg-surface)] border border-[var(--border-light)] shadow-[var(--shadow-lg)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 z-50 overflow-hidden">
                {MOCK_CATEGORIES.map((cat) => (
                  <Link onClick={() => setIsMobileMenuOpen(false)}
                    key={cat.category_id}
                    to={`/menu?category=${cat.category_id}`}
                    className="block px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--btn-primary-default)] border-b border-[var(--border-light)] last:border-0 transition-colors"
                  >
                    {cat.category_name}
                  </Link>
                ))}
              </div>
            </div>

            <Link onClick={() => setIsMobileMenuOpen(false)} to="/store" className={getDesktopLinkStyle("/store")}>
              Store
            </Link>
            <Link
              to="/history"
              aria-current={currentPath === "/history" ? "page" : undefined}
              className={getDesktopLinkStyle("/history")}
            >
              Orders
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {/* Dùng Link để mở giỏ thật; huy hiệu lấy tổng số lượng từ store chung. */}
            <Link onClick={() => setIsMobileMenuOpen(false)}
              to="/cart"
              aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              aria-current={currentPath === "/cart" ? "page" : undefined}
              className="relative rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--btn-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              <ShoppingCart size={24} aria-hidden="true" />
              <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--bg-surface)] bg-[var(--btn-secondary-default)] px-1 text-[10px] font-bold text-[var(--text-inverse)] shadow-[var(--shadow-sm)]">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </Link>

            <Link onClick={() => setIsMobileMenuOpen(false)} to="/auth/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] rounded-full font-bold transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                <User size={18} />
                <span>Login</span>
              </Link>

            <button
              className="md:hidden text-[var(--text-primary)] hover:text-[var(--btn-primary-default)] focus:outline-none"
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="customer-mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="customer-mobile-menu" className="md:hidden bg-[var(--bg-surface)] border-t border-[var(--border-light)] shadow-[var(--shadow-lg)] absolute w-full left-0">
          <div className="flex flex-col px-4 pt-2 pb-6 space-y-3">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/home" className={getMobileLinkStyle("/home")}>
              Home
            </Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/menu" className={getMobileLinkStyle("/menu")}>
              Menu
            </Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/store" className={getMobileLinkStyle("/store")}>
              Store
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={currentPath === "/history" ? "page" : undefined}
              className={getMobileLinkStyle("/history")}
            >
              Orders
            </Link>
            <hr className="border-[var(--border-light)] my-2" />
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/auth/login" className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] rounded-full font-bold transition-colors">
                <User size={18} /> Login
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
