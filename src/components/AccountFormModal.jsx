import { useState } from "react";
import { X, Eye, EyeOff, Save, UserPlus, AlertCircle } from "lucide-react";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

// Modal dùng chung để Thêm tài khoản nhân sự (Admin / Delivery Staff) hoặc Chỉnh sửa thông tin Account
export default function AccountFormModal({
  account,
  roles,
  existingEmails,
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(account);

  const [formData, setFormData] = useState({
    username: account?.username || "",
    email: account?.email || "",
    role_id: account?.role_id || roles[0]?.role_id || 1,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Cập nhật từng trường trong form
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Kiểm tra dữ liệu hợp lệ trước khi lưu (username, email unique, password)
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    if (!trimmedUsername) {
      setError("Please enter a username.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Kiểm tra trùng email (bỏ qua email hiện tại của chính tài khoản đang sửa)
    const isDuplicateEmail = existingEmails.some(
      (email) =>
        email.toLowerCase() === trimmedEmail &&
        email.toLowerCase() !== (account?.email || "").toLowerCase(),
    );
    if (isDuplicateEmail) {
      setError("This email address is already registered to another account.");
      return;
    }

    // Mật khẩu bắt buộc khi tạo mới; khi chỉnh sửa chỉ kiểm tra nếu Admin có nhập mật khẩu mới
    if (!isEditing && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isEditing && formData.password && formData.password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    onSubmit({
      ...formData,
      username: trimmedUsername,
      email: trimmedEmail,
      role_id: Number(formData.role_id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] w-full max-w-md border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header của Modal */}
        <div className="px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
              {isEditing ? "Account Management" : "New Staff Onboarding"}
            </span>
            <h3 className="text-lg font-black uppercase">
              {isEditing ? "Edit Staff Account" : "Add Admin / Delivery Staff"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--bg-surface)]/10 text-[var(--bg-hero)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[var(--bg-badge-discount)] border border-[var(--border-active)]/30 text-[var(--text-badge-discount)] text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tên tài khoản */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Username <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="e.g. shipper_alex"
              className={`${INPUT_CLASS} font-semibold`}
            />
          </div>

          {/* Địa chỉ Email (duy nhất trong hệ thống) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Email Address <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@foodstore.com"
              className={INPUT_CLASS}
            />
          </div>

          {/* Vai trò tài khoản (chỉ gồm Administrator hoặc Delivery Staff) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Staff Role
            </label>
            <select
              value={formData.role_id}
              onChange={(e) => handleChange("role_id", e.target.value)}
              className={`${INPUT_CLASS} font-bold`}
            >
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Mật khẩu (bắt buộc khi thêm mới, tùy chọn khi cập nhật) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              {isEditing ? "New Password (Optional)" : "Password"}{" "}
              {!isEditing && <span className="text-[var(--status-error)]">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={
                  isEditing
                    ? "Leave blank to keep current password"
                    : "Minimum 6 characters"
                }
                className={`${INPUT_CLASS} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nút hành động dưới đáy Modal */}
          <div className="pt-4 border-t border-[var(--border-light)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
            >
              {isEditing ? <Save size={15} /> : <UserPlus size={15} />}
              {isEditing ? "Save Changes" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
