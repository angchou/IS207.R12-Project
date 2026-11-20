import { Edit, Trash2 } from "lucide-react";
import { AddOnCode, LinkedProductList } from "./AddOnTableRow";
import CategoryBadge from "./CategoryBadge";
import { ImageThumbnail } from "./ImageInputField";

// Thẻ hiển thị một add-on trên điện thoại (thay cho dòng bảng khi màn hình nhỏ hơn md)
export default function AddOnMobileCard({
  addon,
  categoryName,
  colorIndex,
  linkedProductNames,
  onEdit,
  onDelete,
}) {
  return (
    <div className="p-4 flex gap-3">
      <ImageThumbnail
        key={addon.image}
        src={addon.image}
        alt={addon.addon_name}
        sizeClass="w-16 h-16"
      />

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Tên + mã add-on */}
        <div>
          <p className="font-bold text-sm text-[var(--text-primary)] leading-snug">
            {addon.addon_name}
          </p>
          <AddOnCode addonId={addon.addon_id} className="text-[11px]" />
        </div>

        <CategoryBadge categoryName={categoryName} colorIndex={colorIndex} />

        {addon.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
            {addon.description}
          </p>
        )}

        {/* Các món đang dùng add-on */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Used In
          </p>
          <LinkedProductList names={linkedProductNames} />
        </div>

        {/* Giá + nút Sửa / Xóa */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="font-black text-[var(--color-price)]">
            ${addon.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(addon)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer"
            >
              <Edit size={13} /> Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(addon)}
              className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] transition-colors cursor-pointer"
              title="Delete Add-on"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
