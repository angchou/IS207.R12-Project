"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

// --- DỮ LIỆU MẪU (Mock Data) ---
const MENU_ITEMS = [
  {
    title: "Tổng quan",
    icon: <LayoutDashboard size={20} />,
    path: "/admin",
    active: true,
  },
  {
    title: "Quản lý Đơn hàng",
    icon: <ShoppingBag size={20} />,
    path: "/admin/orders",
  },
  {
    title: "Sản phẩm & Kích cỡ",
    icon: <Utensils size={20} />,
    path: "/admin/products",
  },
  {
    title: "Combo Khuyến mãi",
    icon: <Package size={20} />,
    path: "/admin/combos",
  },
  {
    title: "Món thêm (Add-ons)",
    icon: <Layers size={20} />,
    path: "/admin/addons",
  },
  {
    title: "Khách hàng & Cấp bậc",
    icon: <Users size={20} />,
    path: "/admin/accounts",
  },
  {
    title: "Cài đặt hệ thống",
    icon: <Settings size={20} />,
    path: "/admin/settings",
  },
];

const RECENT_ORDERS = [
  {
    id: "#ORD-1023",
    customer: "Nguyễn Văn A",
    total: "350,000đ",
    status: "completed",
    date: "12/11/2026 19:30",
  },
  {
    id: "#ORD-1024",
    customer: "Trần Thị B",
    total: "120,000đ",
    status: "pending",
    date: "12/11/2026 20:15",
  },
  {
    id: "#ORD-1025",
    customer: "Lê Hoàng C",
    total: "540,000đ",
    status: "canceled",
    date: "12/11/2026 21:00",
  },
  {
    id: "#ORD-1026",
    customer: "Phạm D",
    total: "250,000đ",
    status: "pending",
    date: "12/11/2026 21:25",
  },
];

export default function AdminHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hàm render Badge Trạng thái mượn màu từ CSS Variable
  const renderStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--status-success)]/10 text-[var(--status-success)] border border-[var(--status-success)]/20">
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--status-warning)]/10 text-[var(--status-warning)] border border-[var(--status-warning)]/20">
            Chờ xử lý
          </span>
        );
      case "canceled":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--status-error)]/10 text-[var(--status-error)] border border-[var(--status-error)]/20">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col transition-all duration-300 bg-[var(--bg-surface)] border-r border-[var(--border-divider)] z-20 shadow-[var(--shadow-sm)]`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-divider)]">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-xl text-[var(--btn-primary-default)] truncate">
              <Utensils className="text-[var(--btn-secondary-default)]" />
              FoodyAdmin
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors mx-auto"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {MENU_ITEMS.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                item.active
                  ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-badge-discount)] hover:text-[var(--btn-primary-default)]"
              }`}
              title={!isSidebarOpen ? item.title : ""}
            >
              <div
                className={`${item.active ? "text-[var(--text-inverse)]" : "text-[var(--text-muted)] group-hover:text-[var(--btn-primary-default)]"}`}
              >
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="font-medium whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--border-divider)]">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-[var(--text-secondary)] hover:text-[var(--status-error)] hover:bg-[var(--status-error)]/10 rounded-xl transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-divider)] flex items-center justify-between px-6 z-10 shadow-[var(--shadow-sm)]">
          {/* Search */}
          <div className="relative w-96 hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, sản phẩm..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-full text-sm focus:outline-none focus:border-[var(--btn-primary-default)] focus:ring-1 focus:ring-[var(--focus-ring)] transition-all"
            />
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--btn-primary-default)] transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--status-error)] rounded-full border-2 border-[var(--bg-surface)]"></span>
            </button>
            <div className="h-8 w-[1px] bg-[var(--border-divider)] mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Admin User
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Quản lý hệ thống
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--btn-secondary-default)] text-[var(--text-inverse)] flex items-center justify-center font-bold text-lg shadow-[var(--shadow-sm)]">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Tổng quan hệ thống
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Cập nhật tình hình kinh doanh hôm nay.
              </p>
            </div>

            {/* Thống kê (Stats Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Doanh thu */}
              <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-md)] flex items-center gap-4 border-l-4 border-l-[var(--btn-primary-default)]">
                <div className="p-3 bg-[var(--bg-badge-discount)] text-[var(--btn-primary-default)] rounded-xl">
                  <DollarSign size={28} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Doanh thu hôm nay
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    12,500,000đ
                  </p>
                </div>
              </div>

              {/* Card 2: Đơn hàng */}
              <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-md)] flex items-center gap-4 border-l-4 border-l-[var(--btn-secondary-default)]">
                <div className="p-3 bg-orange-100 text-[var(--btn-secondary-default)] rounded-xl">
                  <ShoppingCart size={28} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Đơn hàng mới
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    45
                  </p>
                </div>
              </div>

              {/* Card 3: Khách hàng */}
              <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-md)] flex items-center gap-4 border-l-4 border-l-[var(--status-info)]">
                <div className="p-3 bg-blue-50 text-[var(--status-info)] rounded-xl">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Khách hàng mới
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    12
                  </p>
                </div>
              </div>

              {/* Card 4: Tăng trưởng */}
              <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-md)] flex items-center gap-4 border-l-4 border-l-[var(--status-success)]">
                <div className="p-3 bg-green-50 text-[var(--status-success)] rounded-xl">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Tỉ lệ chuyển đổi
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    4.2%
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng Đơn hàng gần đây (Recent Orders Table) */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-md)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border-divider)] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Đơn hàng mới nhất
                </h2>
                <button className="text-sm font-medium text-[var(--btn-primary-default)] hover:text-[var(--btn-primary-hover)] transition-colors">
                  Xem tất cả
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-sm">
                      <th className="px-6 py-4 font-medium">Mã đơn</th>
                      <th className="px-6 py-4 font-medium">
                        Khách hàng (Người nhận)
                      </th>
                      <th className="px-6 py-4 font-medium">Tổng tiền</th>
                      <th className="px-6 py-4 font-medium">Ngày đặt</th>
                      <th className="px-6 py-4 font-medium">Trạng thái</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-divider)] text-sm">
                    {RECENT_ORDERS.map((order, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[var(--bg-main)] transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-[var(--btn-primary-default)]">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-primary)]">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 font-bold text-[var(--color-price)]">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-muted)]">
                          {order.date}
                        </td>
                        <td className="px-6 py-4">
                          {renderStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-4 py-1.5 bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] rounded-lg transition-colors">
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
