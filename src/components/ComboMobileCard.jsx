import { Edit } from "lucide-react";
import { ImageThumbnail } from "./ImageInputField";
import { ProductTagBadge } from "./ProductTableRow";
import {
  ComboCode,
  ComboBadge,
  ComboBlockedBadge,
  ComboItemList,
  ComboPrice,
  ComboStatusToggle,
} from "./ComboTableRow";
import { COMBO_STATUS } from "./comboConstants";

// Thẻ hiển thị một combo trên điện thoại (thay cho dòng bảng khi màn hình nhỏ hơn md)
export default function ComboMobileCard({
  combo,
  items,
  blockers,
  onToggleStatus,
  onEdit,
}) {
  const isOn = combo.status !== COMBO_STATUS.UNAVAILABLE;

  return (
    <div className="p-4 space-y-3">
      <div className={`flex gap-3 ${isOn ? "" : "opacity-60"}`}>
        <ImageThumbnail
          key={combo.image}
          src={combo.image}
          alt={combo.combo_name}
          sizeClass="w-16 h-16"
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-bold text-sm text-[var(--text-primary)] leading-snug">
            {combo.combo_name}
          </p>
          <ComboCode comboId={combo.combo_id} className="text-[11px]" />
          <div className="flex flex-wrap items-center gap-1.5">
            <ComboBadge badge={combo.badge} />
            <ProductTagBadge tag={combo.tag} />
            <ComboBlockedBadge blockers={blockers} />
          </div>
        </div>
      </div>

      {/* Món trong combo + giá */}
      <div className="flex items-start justify-between gap-3">
        <ComboItemList items={items} />
        <div className="text-right shrink-0">
          <ComboPrice
            price={combo.price}
            originalPrice={combo.original_price}
          />
        </div>
      </div>

      {/* Trạng thái + nút Sửa */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <ComboStatusToggle
          status={combo.status}
          comboName={combo.combo_name}
          onToggle={() => onToggleStatus(combo)}
        />
        <button
          type="button"
          onClick={() => onEdit(combo)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer shrink-0"
        >
          <Edit size={13} /> Edit
        </button>
      </div>
    </div>
  );
}
