import { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  User,
  X,
  Flame,
  ChevronDown,
  Bell,
  LogOut,
} from "lucide-react";

const ADMIN_CATALOG_MENU = [
  { id: "products", name: "Products Management", path: "/admin/product" },
  { id: "combos", name: "Combos Management", path: "/admin/combo" },
  { id: "addons", name: "Add-ons Management", path: "/admin/add_on" },
];

export default function AdminNavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Nâng cấp: Cho phép truyền mảng các đường dẫn (paths) để highlight menu cha khi ở trang con
  const isPathActive = (path) => {
    if (Array.isArray(path)) {
      return path.some(
        (p) =>
          currentPath === p || (p !== "/admin" && currentPath.startsWith(p)),
      );
    }
    return (
      currentPath === path ||
      (path !== "/admin" && currentPath.startsWith(path))
    );
  };

  const getDesktopLinkStyle = (path) => {
    return isPathActive(path)
      ? "text-[var(--btn-primary-default)] font-bold border-b-2 border-[var(--btn-primary-default)] h-full flex items-center"
      : "text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] font-semibold h-full flex items-center transition-colors";
  };

  const getMobileLinkStyle = (path) => {
    return isPathActive(path)
      ? "text-[var(--btn-primary-default)] font-bold block px-3 py-3 bg-[var(--bg-subtle)] rounded-full"
      : "text-[var(--text-secondary)] font-semibold block px-3 py-3 hover:bg-[var(--bg-main)] rounded-full transition-colors";
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--bg-surface,#ffffff)] shadow-[var(--shadow-sm)] border-b border-[var(--border-light)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <a
            href="/admin/home"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-[var(--bg-subtle)] rounded-full group-hover:bg-[var(--bg-main)] transition-colors">
              <Flame size={28} className="text-[var(--btn-primary-default)]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[var(--text-primary)]">
              Ditme
              <span className="text-[var(--btn-primary-default)]">Admin</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <a
              href="/admin/home"
              className={getDesktopLinkStyle("/admin/home")}
            >
              Home
            </a>

            {/* Catalog Dropdown */}
            <div className="relative group h-full flex items-center">
              <div
                className={`cursor-pointer ${getDesktopLinkStyle([
                  "/admin/product",
                  "/admin/combo",
                  "/admin/add_on",
                ])} gap-1`}
              >
                Catalog{" "}
                <ChevronDown
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </div>

              <div className="absolute top-full left-0 w-56 bg-[var(--bg-surface,#ffffff)] border border-[var(--border-light)] shadow-[var(--shadow-lg)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden rounded-b-md">
                {ADMIN_CATALOG_MENU.map((item) => (
                  <a
                    key={item.id}
                    href={item.path}
                    className="block px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--btn-primary-default)] border-b border-[var(--border-light)] last:border-0 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/admin/setting"
              className={getDesktopLinkStyle("/admin/setting")}
            >
              Settings
            </a>

            <a
              href="/admin/employee"
              className={getDesktopLinkStyle("/admin/employee")}
            >
              Employees
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5">
            {/* Admin Profile / Logout */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  John Doe
                </span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Admin
                </span>
              </div>
              <button className="flex items-center justify-center p-2.5 bg-[var(--bg-subtle)] hover:bg-[var(--btn-primary-hover)] hover:text-[var(--text-inverse,#ffffff)] text-[var(--text-primary)] rounded-full font-bold transition-all shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
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
            <a href="/admin/home" className={getMobileLinkStyle("/admin/home")}>
              Home
            </a>

            <div className="text-[var(--text-secondary)] font-semibold block px-3 pt-2">
              Catalog Management
            </div>

            <div className="pl-4 border-l-2 border-[var(--border-light)] ml-3 space-y-2">
              {ADMIN_CATALOG_MENU.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className={getMobileLinkStyle(item.path)}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <a
              href="/admin/setting"
              className={getMobileLinkStyle("/admin/setting")}
            >
              Settings
            </a>

            <a
              href="/admin/employee"
              className={getMobileLinkStyle("/admin/employee")}
            >
              Employees
            </a>

            <hr className="border-[var(--border-light)] my-2" />

            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full font-bold transition-colors">
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
