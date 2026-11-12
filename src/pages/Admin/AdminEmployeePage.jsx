"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  UserCog,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_ROLES = [
  { role_id: 0, role_name: "Tất cả vai trò", role_code: "all" },
  { role_id: 1, role_name: "Quản trị viên (Admin)", role_code: "admin" },
  { role_id: 2, role_name: "Quản lý chi nhánh", role_code: "manager" },
  { role_id: 3, role_name: "Nhân viên Bếp", role_code: "staff" },
  { role_id: 4, role_name: "Giao hàng (Shipper)", role_code: "shipper" },
];

const MOCK_EMPLOYEES = [
  {
    account_id: "EMP-001",
    username: "admin_super",
    email: "admin@foody.com",
    role_id: 1,
    status: "active",
    created_at: "01/01/2026",
  },
  {
    account_id: "EMP-002",
    username: "manager_q1",
    email: "manager.q1@foody.com",
    role_id: 2,
    status: "active",
    created_at: "15/02/2026",
  },
  {
    account_id: "EMP-003",
    username: "staff_kitchen1",
    email: "kitchen.bep1@foody.com",
    role_id: 3,
    status: "active",
    created_at: "10/03/2026",
  },
  {
    account_id: "EMP-004",
    username: "shipper_01",
    email: "delivery.01@foody.com",
    role_id: 4,
    status: "inactive",
    created_at: "20/05/2026",
  },
];

export default function AdminEmployeePage() {
  // State quản lý UI & Filter
  const [selectedRole, setSelectedRole] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý Modal
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Lọc dữ liệu dựa trên Role và Search (Giống logic CustomerHomePage)
  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    const matchesRole = selectedRole === 0 || emp.role_id === selectedRole;
    const matchesSearch =
      emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Xử lý mở Modal
  const openEmployeeModal = (employee = null) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  // Helper render Role Name dựa vào ID
  const getRoleName = (roleId) => {
    return MOCK_ROLES.find((r) => r.role_id === roleId)?.role_name || "Unknown";
  };

  return (
    <div className="min-h-full flex flex-col font-sans selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)] bg-[var(--bg-main)]">
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* === Header Section (Đồng bộ font-black, uppercase) === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--btn-secondary-default)] uppercase tracking-wider mb-2">
              <UserCog size={16} /> Human Resources
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Quản lý nhân sự
            </h2>
            <div className="w-16 h-1 bg-[var(--btn-primary-default)] mt-3"></div>
          </div>

          <button
            onClick={() => openEmployeeModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] font-bold text-sm uppercase tracking-wide rounded-full shadow-md transition-all"
          >
            <Plus size={18} /> Thêm nhân viên
          </button>
        </div>

        {/* === Công cụ Lọc & Tìm kiếm (Sử dụng Tab giống Category Menu) === */}
        <div className="flex flex-col xl:flex-row justify-between gap-6 mb-8">
          {/* Tab Danh mục (Roles) */}
          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 no-scrollbar w-full xl:w-2/3">
            {MOCK_ROLES.map((role) => {
              const isActive = selectedRole === role.role_id;
              return (
                <button
                  key={role.role_id}
                  onClick={() => setSelectedRole(role.role_id)}
                  className={`whitespace-nowrap px-5 py-2.5 font-bold text-xs uppercase border-2 rounded-full transition-all ${
                    isActive
                      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)] shadow-md"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                  }`}
                >
                  {role.role_name}
                </button>
              );
            })}
          </div>

          {/* Ô Tìm kiếm */}
          <div className="relative w-full xl:w-1/3">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] rounded-full text-sm font-medium focus:outline-none focus:border-[var(--btn-primary-default)] transition-all placeholder:font-normal"
            />
          </div>
        </div>

        {/* === Bảng dữ liệu === */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border-2 border-[var(--border-divider)] overflow-hidden shadow-[var(--shadow-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
                  <th className="px-6 py-5">Tài khoản</th>
                  <th className="px-6 py-5">Liên hệ</th>
                  <th className="px-6 py-5">Vai trò</th>
                  <th className="px-6 py-5">Ngày tạo</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[var(--border-divider)] text-sm font-medium text-[var(--text-secondary)]">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.account_id}
                      className="hover:bg-[var(--bg-subtle)] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--bg-hero)] text-[var(--btn-secondary-default)] flex items-center justify-center font-black text-lg border-2 border-[var(--border-divider)]">
                            {emp.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)] text-base">
                              {emp.username}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] font-mono">
                              {emp.account_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">{emp.email}</td>

                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                          <Tag
                            size={14}
                            className="text-[var(--btn-secondary-default)]"
                          />
                          {getRoleName(emp.role_id)}
                        </span>
                      </td>

                      <td className="px-6 py-4">{emp.created_at}</td>

                      <td className="px-6 py-4">
                        {emp.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--status-success)]/10 text-[var(--status-success)] text-xs font-bold border border-[var(--status-success)]/20">
                            <CheckCircle2 size={14} /> Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--text-muted)]/10 text-[var(--text-muted)] text-xs font-bold border border-[var(--text-muted)]/20">
                            <XCircle size={14} /> Tạm khóa
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEmployeeModal(emp)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--btn-primary-default)] hover:bg-[var(--bg-hero)] rounded-full transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-[var(--text-muted)] hover:text-[var(--status-warning)] hover:bg-orange-50 rounded-full transition-all">
                            <Lock size={18} />
                          </button>
                          <button className="p-2 text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--status-error)]/10 rounded-full transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-[var(--text-muted)]"
                    >
                      Không tìm thấy nhân viên nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- Giả lập Modal (Tương tự CustomizerModal bên CustomerHome) --- */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-overlay)] backdrop-blur-sm">
          <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 border-2 border-[var(--border-divider)]">
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">
              {selectedEmployee ? "Cập nhật tài khoản" : "Thêm nhân viên mới"}
            </h3>
            <p className="text-[var(--text-muted)] mb-6 text-sm">
              Modal component sẽ được tách ra thành file riêng tương tự
              `CustomizerModal.jsx`.
            </p>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="px-5 py-2.5 rounded-full font-bold text-sm text-[var(--text-primary)] border-2 border-[var(--border-divider)] hover:border-[var(--text-primary)] transition-all"
              >
                ĐÓNG
              </button>
              <button className="px-5 py-2.5 rounded-full font-bold text-sm text-[var(--text-inverse)] bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] transition-all shadow-md">
                LƯU THAY ĐỔI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
