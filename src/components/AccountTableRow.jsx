import { Edit, Trash2, Shield, Truck } from "lucide-react";

// Cấu hình màu sắc và biểu tượng theo vai trò nhân sự cửa hàng (Admin & Shipper)
const ROLE_BADGE_MAP = {
  Admin: {
    icon: <Shield size={12} />,
    classes:
      "bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)] border-[var(--border-active)]/30",
    label: "Administrator",
  },
  Shipper: {
    icon: <Truck size={12} />,
    classes:
      "bg-[var(--status-info)]/15 text-[var(--status-info)] border-[var(--status-info)]/30",
    label: "Delivery Staff",
  },
};

// Component một dòng tài khoản nhân sự trong bảng quản lý
export default function AccountTableRow({
  account,
  roleName,
  onEdit,
  onDelete,
}) {
  const badge = ROLE_BADGE_MAP[roleName] || ROLE_BADGE_MAP.Shipper;

  return (
    <tr className="hover:bg-[var(--bg-main)] transition-colors">
      {/* Cột tài khoản + Avatar tròn 50% */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-hero)] text-[var(--btn-primary-default)] flex items-center justify-center font-black text-base border border-[var(--border-divider)] shrink-0">
            {account.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)]">
              {account.username}
            </p>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              #ACC-{String(account.account_id).padStart(3, "0")}
            </p>
          </div>
        </div>
      </td>

      {/* Cột Email */}
      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
        {account.email}
      </td>

      {/* Cột Vai trò (Badge bo 50%) */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.classes}`}
        >
          {badge.icon}
          {badge.label}
        </span>
      </td>

      {/* Cột Ngày tạo */}
      <td className="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">
        {account.created_at}
      </td>

      {/* Cột Nút thao tác Sửa / Xóa */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(account)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer"
          >
            <Edit size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(account)}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] transition-colors cursor-pointer"
            title="Delete Account"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
