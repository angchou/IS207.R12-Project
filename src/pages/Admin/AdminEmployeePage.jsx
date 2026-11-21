import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  UserCog,
  Users,
  Shield,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AdminKpiCard from "../../components/AdminKpiCard";
import AccountTableRow from "../../components/AccountTableRow";
import AccountFormModal from "../../components/AccountFormModal";

// Danh sách vai trò nhân sự cửa hàng ánh xạ theo bảng ROLE trong database (chỉ gồm Admin và Shipper)
const STAFF_ROLES = [
  { role_id: 1, role_name: "Admin", display_name: "Administrator" },
  { role_id: 2, role_name: "Shipper", display_name: "Delivery Staff" },
];

// Dữ liệu tài khoản nhân sự mẫu ánh xạ theo bảng ACCOUNT trong database
const INITIAL_STAFF_ACCOUNTS = [
  {
    account_id: 1,
    role_id: 1,
    username: "john_admin",
    email: "admin@foodstore.com",
    password: "••••••••",
    created_at: "Jan 10, 2026",
  },
  {
    account_id: 2,
    role_id: 1,
    username: "sarah_ops",
    email: "sarah.admin@foodstore.com",
    password: "••••••••",
    created_at: "Feb 04, 2026",
  },
  {
    account_id: 3,
    role_id: 2,
    username: "david_shipper",
    email: "david.delivery@foodstore.com",
    password: "••••••••",
    created_at: "Mar 15, 2026",
  },
  {
    account_id: 4,
    role_id: 2,
    username: "minh_delivery",
    email: "minh.delivery@foodstore.com",
    password: "••••••••",
    created_at: "Apr 22, 2026",
  },
];

export default function AdminEmployeePage() {
  // Danh sách tài khoản nhân sự (chỉ giữ role_id 1: Admin và 2: Shipper, ưu tiên đọc từ localStorage)
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_accounts_list");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const staffOnly = parsed.filter(
            (acc) => acc.role_id === 1 || acc.role_id === 2,
          );
          if (staffOnly.length > 0) return staffOnly;
        }
      }
    } catch {
      // Fallback về dữ liệu mẫu khi lỗi JSON
    }
    return INITIAL_STAFF_ACCOUNTS;
  });

  // State lọc theo vai trò (0 = tất cả nhân sự) và ô tìm kiếm
  const [selectedRoleId, setSelectedRoleId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý Modal thêm/chỉnh sửa tài khoản và Toast thông báo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Hiển thị thông báo ngắn trong 3 giây
  const triggerToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lưu danh sách tài khoản nhân sự vào localStorage
  const persistAccounts = (nextList) => {
    setAccounts(nextList);
    try {
      localStorage.setItem("admin_accounts_list", JSON.stringify(nextList));
    } catch {
      // Bỏ qua nếu đầy bộ nhớ trình duyệt
    }
  };

  // Lấy tên vai trò theo mã role_id
  const getRoleName = (roleId) =>
    STAFF_ROLES.find((r) => r.role_id === Number(roleId))?.role_name ||
    "Shipper";

  // Thống kê số lượng tài khoản theo từng vai trò cho các thẻ KPI
  const roleStats = useMemo(() => {
    const adminCount = accounts.filter((a) => a.role_id === 1).length;
    const shipperCount = accounts.filter((a) => a.role_id === 2).length;
    return {
      total: accounts.length,
      admins: adminCount,
      shippers: shipperCount,
    };
  }, [accounts]);

  // Lọc danh sách hiển thị theo tab vai trò và từ khóa tìm kiếm
  const filteredAccounts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return accounts.filter((acc) => {
      const matchRole =
        selectedRoleId === 0 || acc.role_id === Number(selectedRoleId);
      const matchSearch =
        acc.username.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [accounts, selectedRoleId, searchQuery]);

  // Mở Modal ở chế độ Thêm mới hoặc Chỉnh sửa tài khoản
  const openCreateModal = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  // Xử lý lưu tài khoản sau khi submit form trong Modal
  const handleSaveAccount = (formValues) => {
    if (editingAccount) {
      // Cập nhật thông tin tài khoản hiện có
      const updatedList = accounts.map((acc) =>
        acc.account_id === editingAccount.account_id
          ? {
              ...acc,
              username: formValues.username,
              email: formValues.email,
              role_id: formValues.role_id,
              password: formValues.password ? "••••••••" : acc.password,
            }
          : acc,
      );
      persistAccounts(updatedList);
      triggerToast(`Updated account "${formValues.username}" successfully.`);
    } else {
      // Thêm tài khoản Admin hoặc Delivery Staff mới
      const nextId =
        accounts.reduce((max, acc) => Math.max(max, acc.account_id), 0) + 1;
      const todayLabel = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const newAccount = {
        account_id: nextId,
        role_id: formValues.role_id,
        username: formValues.username,
        email: formValues.email,
        password: "••••••••",
        created_at: todayLabel,
      };
      persistAccounts([newAccount, ...accounts]);
      triggerToast(
        `Created new ${getRoleName(formValues.role_id)} account "${formValues.username}".`,
      );
    }

    setIsModalOpen(false);
    setEditingAccount(null);
  };

  // Xóa tài khoản (đảm bảo luôn giữ lại tối thiểu 1 tài khoản Admin)
  const handleDeleteAccount = (account) => {
    if (account.role_id === 1 && roleStats.admins <= 1) {
      triggerToast(
        "Cannot delete the last remaining Administrator account.",
        "error",
      );
      return;
    }

    const remaining = accounts.filter(
      (acc) => acc.account_id !== account.account_id,
    );
    persistAccounts(remaining);
    triggerToast(`Removed account "${account.username}".`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)] pt-[72px]">
      {/* Thông báo Toast nổi góc dưới bên phải */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 shadow-[var(--shadow-lg)] border-2 border-[var(--border-light)] bg-[var(--bg-dark)] text-[var(--text-inverse)]">
          {toastMessage.type === "error" ? (
            <AlertCircle
              size={20}
              className="text-[var(--status-error)] shrink-0"
            />
          ) : (
            <CheckCircle2
              size={20}
              className="text-[var(--btn-secondary-default)] shrink-0"
            />
          )}
          <span className="text-sm font-bold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* ================= 1. TIÊU ĐỀ TRANG & NÚT THÊM NHÂN SỰ ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <UserCog size={14} /> Store Staff Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Staff Account Management
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
              Create new Administrator or Delivery Staff accounts and update
              store staff account information.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] shadow-[var(--shadow-md)] transition-all cursor-pointer self-start lg:self-auto"
          >
            <UserPlus size={16} /> Add Admin / Delivery Staff
          </button>
        </div>

        {/* ================= 2. THẺ KPI TỔNG QUAN NHÂN SỰ (TÁI SỬ DỤNG AdminKpiCard) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AdminKpiCard
            title="Total Store Staff"
            value={roleStats.total}
            subtext="Active staff accounts"
            icon={<Users size={22} />}
            accentColor="var(--btn-primary-default)"
          />
          <AdminKpiCard
            title="Administrators"
            value={roleStats.admins}
            subtext="Full store access"
            icon={<Shield size={22} />}
            accentColor="var(--btn-secondary-default)"
          />
          <AdminKpiCard
            title="Delivery Staff"
            value={roleStats.shippers}
            subtext="Active shippers"
            icon={<Truck size={22} />}
            accentColor="var(--status-info)"
          />
        </div>

        {/* ================= 3. BẢNG DANH SÁCH TÀI KHOẢN NHÂN SỰ & BỘ LỌC ================= */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Thanh lọc theo vai trò & tìm kiếm */}
          <div className="p-6 border-b-2 border-[var(--border-divider)] flex flex-col xl:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedRoleId(0)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
                  selectedRoleId === 0
                    ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                    : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                }`}
              >
                All Staff ({roleStats.total})
              </button>

              {STAFF_ROLES.map((role) => {
                const isActive = selectedRoleId === role.role_id;
                return (
                  <button
                    key={role.role_id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.role_id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                        : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    {role.display_name}
                  </button>
                );
              })}
            </div>

            {/* Ô tìm kiếm tài khoản */}
            <div className="relative w-full xl:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
              />
            </div>
          </div>

          {/* Bảng dữ liệu tài khoản */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] text-sm">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => (
                    <AccountTableRow
                      key={acc.account_id}
                      account={acc}
                      roleName={getRoleName(acc.role_id)}
                      onEdit={openEditModal}
                      onDelete={handleDeleteAccount}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-xs font-medium text-[var(--text-muted)]"
                    >
                      No staff accounts match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal thêm mới Admin/Shipper hoặc chỉnh sửa thông tin tài khoản */}
      {isModalOpen && (
        <AccountFormModal
          account={editingAccount}
          roles={STAFF_ROLES}
          existingEmails={accounts.map((a) => a.email)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAccount(null);
          }}
          onSubmit={handleSaveAccount}
        />
      )}
    </div>
  );
}
