import { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  X,
  Bike,
  Package,
  MapPin,
  ClipboardList,
  LogOut,
  Bell,
} from "lucide-react";

export default function ShipperNavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const getDesktopLinkStyle = (path) => {
    const isActive =
      currentPath === path ||
      (path !== "/shipper" && currentPath.startsWith(path));
    return isActive
      ? "text-[var(--btn-primary-default)] font-bold border-b-2 border-[var(--btn-primary-default)] h-full flex items-center gap-2"
      : "text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] font-semibold h-full flex items-center gap-2 transition-colors";
  };

  const getMobileLinkStyle = (path) => {
    const isActive =
      currentPath === path ||
      (path !== "/shipper" && currentPath.startsWith(path));
    return isActive
      ? "text-[var(--btn-primary-default)] font-bold flex items-center gap-3 px-4 py-3 bg-[var(--bg-subtle)] rounded-full"
      : "text-[var(--text-secondary)] font-semibold flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-main)] rounded-full transition-colors";
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--bg-surface,#ffffff)] shadow-[var(--shadow-sm)] border-b border-[var(--border-light)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <a
            href="/shipper/orders"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-[var(--bg-subtle)] rounded-full group-hover:bg-[var(--bg-main)] transition-colors">
              <Bike size={28} className="text-[var(--btn-primary-default)]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[var(--text-primary)]">
              Ditme
              <span className="text-[var(--btn-primary-default)]">Shipper</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <a
              href="/shipper/orders"
              className={getDesktopLinkStyle("/shipper/orders")}
            >
              <Package size={18} /> Pending Orders
            </a>

            <a
              href="/shipper/active"
              className={getDesktopLinkStyle("/shipper/active")}
            >
              <MapPin size={18} /> Active Deliveries
            </a>

            <a
              href="/shipper/history"
              className={getDesktopLinkStyle("/shipper/history")}
            >
              <ClipboardList size={18} /> Order History
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] transition-colors rounded-full p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
              <Bell size={24} />
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-[var(--text-inverse,#ffffff)] bg-[var(--btn-secondary-default,red)] border-2 border-[var(--bg-surface,#ffffff)] rounded-full shadow-[var(--shadow-sm)]">
                2
              </span>
            </button>

            {/* Shipper Profile / Logout */}
            <div className="hidden md:flex items-center gap-3 border-l border-[var(--border-light)] pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  John Doe
                </span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Delivery Partner
                </span>
              </div>
              <button className="flex items-center justify-center p-2.5 bg-[var(--bg-subtle)] hover:bg-[var(--btn-primary-hover)] hover:text-[var(--text-inverse,#ffffff)] text-[var(--text-primary)] rounded-full font-bold transition-all shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[var(--text-primary)] hover:text-[var(--btn-primary-default)] focus:outline-none p-1"
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
          <div className="flex flex-col px-4 pt-4 pb-6 space-y-3">
            {/* Mobile User Info */}
            <div className="flex items-center gap-3 px-2 pb-3 mb-2 border-b border-[var(--border-light)]">
              <div className="w-10 h-10 bg-[var(--bg-subtle)] rounded-full flex items-center justify-center text-[var(--btn-primary-default)]">
                <Bike size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  John Doe
                </div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">
                  Online
                </div>
              </div>
            </div>

            {/* Links */}
            <a
              href="/shipper/orders"
              className={getMobileLinkStyle("/shipper/orders")}
            >
              <Package size={20} /> Pending Orders
            </a>
            <a
              href="/shipper/active"
              className={getMobileLinkStyle("/shipper/active")}
            >
              <MapPin size={20} /> Active Deliveries
            </a>
            <a
              href="/shipper/history"
              className={getMobileLinkStyle("/shipper/history")}
            >
              <ClipboardList size={20} /> Order History
            </a>

            <hr className="border-[var(--border-light)] my-2" />

            <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[var(--bg-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full font-bold transition-colors">
              <LogOut size={20} /> Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
