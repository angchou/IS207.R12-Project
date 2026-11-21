import { Edit, Trash2 } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { ImageThumbnail } from "./ImageInputField";

// Mã hiển thị của add-on, ví dụ #ADD-001
export function AddOnCode({ addonId, className = "text-xs" }) {
  return (
    <p className={`${className} text-[var(--text-muted)] font-mono`}>
      #ADD-{String(addonId).padStart(3, "0")}
    </p>
  );
}

// Danh sách tên món đang gắn add-on: tối đa 3 tên, phần còn lại hiện "+n more" (di chuột để xem hết)
export function LinkedProductList({ names, maxShown = 3 }) {
  if (names.length === 0) {
    return (
      <span className="text-xs italic text-[var(--text-muted)]">
        Not used yet
      </span>
    );
  }
  const shown = names.slice(0, maxShown);
  const remaining = names.length - shown.length;
  return (
    <ul className="space-y-1 text-xs" title={names.join(", ")}>
      {shown.map((name) => (
        <li
          key={name}
          className="flex items-center gap-1.5 text-[var(--text-secondary)] font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-secondary-default)] shrink-0" />
          <span className="truncate max-w-[200px]">{name}</span>
        </li>
      ))}
      {remaining > 0 && (
        <li className="pl-3 font-bold text-[var(--text-muted)]">
          +{remaining} more
        </li>
      )}
    </ul>
  );
}

// Component một dòng add-on trong bảng quản lý (màn hình từ md trở lên)
export default function AddOnTableRow({
  addon,
  categoryName,
  colorIndex,
  linkedProductNames,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="hover:bg-[var(--bg-main)] transition-colors">
      {/* Cột Add-on: ảnh + tên + mã */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ImageThumbnail
            key={addon.image}
            src={addon.image}
            alt={addon.addon_name}
          />
          <div className="min-w-0">
            <p className="font-bold text-[var(--text-primary)]">
              {addon.addon_name}
            </p>
            <AddOnCode addonId={addon.addon_id} />
          </div>
        </div>
      </td>

      {/* Cột Category (Badge bo 50%) */}
      <td className="px-6 py-4">
        <CategoryBadge categoryName={categoryName} colorIndex={colorIndex} />
      </td>

      {/* Cột Mô tả (ẩn ở tablet để bảng không bị tràn) */}
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-[var(--text-secondary)] max-w-xs">
        {addon.description ? (
          <p className="line-clamp-2">{addon.description}</p>
        ) : (
          <span className="text-xs italic text-[var(--text-muted)]">
            No description
          </span>
        )}
      </td>

      {/* Cột Giá */}
      <td className="px-6 py-4 font-black text-[var(--color-price)] whitespace-nowrap">
        ${addon.price.toFixed(2)}
      </td>

      {/* Cột các món đang dùng add-on (bảng PRODUCT_ADDON join PRODUCT) */}
      <td className="px-6 py-4">
        <LinkedProductList names={linkedProductNames} />
      </td>

      {/* Cột Nút thao tác Sửa / Xóa */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(addon)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer"
          >
            <Edit size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(addon)}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] transition-colors cursor-pointer"
            title="Delete Add-on"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
