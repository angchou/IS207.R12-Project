import { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  ShoppingCart,
  User,
  X,
  Flame,
  ChevronDown,
} from "lucide-react";
import { MOCK_CATEGORIES } from "../../data/mockData";

export default function CustomerNavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

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
    <nav className="fixed top-0 z-50 w-full bg-[var(--bg-surface,#ffffff)] shadow-[var(--shadow-sm)] border-b border-[var(--border-light)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          <a
            href="/home"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-[var(--bg-subtle)] rounded-full group-hover:bg-[var(--bg-main)] transition-colors">
              <Flame size={28} className="text-[var(--btn-primary-default)]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[var(--text-primary)]">
              Ditme
              <span className="text-[var(--btn-primary-default)]">UIT</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <a href="/home" className={getDesktopLinkStyle("/home")}>
              Home
            </a>

            <div className="relative group h-full flex items-center">
              <a
                href="/menu"
                className={`${getDesktopLinkStyle("/menu")} gap-1`}
              >
                Menu{" "}
                <ChevronDown
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </a>

              <div className="absolute top-full left-0 w-56 bg-[var(--bg-surface,#ffffff)] border border-[var(--border-light)] shadow-[var(--shadow-lg)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                {MOCK_CATEGORIES.map((cat) => (
                  <a
                    key={cat.category_id}
                    href={`/menu?category=${cat.category_id}`}
                    className="block px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--btn-primary-default)] border-b border-[var(--border-light)] last:border-0 transition-colors"
                  >
                    {cat.category_name}
                  </a>
                ))}
              </div>
            </div>

            <a href="/store" className={getDesktopLinkStyle("/store")}>
              Store
            </a>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] transition-colors rounded-full p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-[var(--text-inverse,#ffffff)] bg-[var(--btn-secondary-default)] border-2 border-[var(--bg-surface,#ffffff)] rounded-full shadow-[var(--shadow-sm)]">
                0
              </span>
            </button>

            <a href="/auth/login">
              <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse,#ffffff)] rounded-full font-bold transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                <User size={18} />
                <span>Login</span>
              </button>
            </a>

            <button
              className="md:hidden text-[var(--text-primary)] hover:text-[var(--btn-primary-default)] focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface,#ffffff)] border-t border-[var(--border-light)] shadow-[var(--shadow-lg)] absolute w-full left-0">
          <div className="flex flex-col px-4 pt-2 pb-6 space-y-3">
            <a href="/home" className={getMobileLinkStyle("/home")}>
              Home
            </a>
            <a href="/menu" className={getMobileLinkStyle("/menu")}>
              Menu
            </a>
            <a href="/store" className={getMobileLinkStyle("/store")}>
              Store
            </a>
            <hr className="border-[var(--border-light)] my-2" />
            <a href="/auth/login">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse,#ffffff)] rounded-full font-bold transition-colors">
                <User size={18} /> Login
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
