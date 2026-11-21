import { Edit } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { ImageThumbnail } from "./ImageInputField";
import {
  ProductCode,
  ProductTagBadge,
  ProductSizePrices,
  ProductAddonSummary,
} from "./ProductTableRow";
import StatusToggle from "./StatusToggle";
import { PRODUCT_STATUS } from "./productConstants";

// Thẻ hiển thị một món trên điện thoại (thay cho dòng bảng khi màn hình nhỏ hơn md)
export default function ProductMobileCard({
  product,
  categoryName,
  colorIndex,
  addonNames,
  onToggleStatus,
  onEdit,
}) {
  const isAvailable = product.status !== PRODUCT_STATUS.UNAVAILABLE;

  return (
    <div className="p-4 space-y-3">
      <div className={`flex gap-3 ${isAvailable ? "" : "opacity-60"}`}>
        <ImageThumbnail
          key={product.image}
          src={product.image}
          alt={product.product_name}
          sizeClass="w-16 h-16"
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-bold text-sm text-[var(--text-primary)] leading-snug">
            {product.product_name}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <ProductCode
              productId={product.product_id}
              className="text-[11px]"
            />
            <ProductTagBadge tag={product.tag} />
          </div>
          <CategoryBadge categoryName={categoryName} colorIndex={colorIndex} />
        </div>
      </div>

      {/* Size & giá + toàn bộ add-on của món */}
      <ProductSizePrices sizes={product.sizes} />
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Add-ons ({addonNames.length})
        </p>
        <ProductAddonSummary addonNames={addonNames} />
      </div>

      {/* Trạng thái bán + nút Sửa */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <StatusToggle
          isOn={isAvailable}
          itemName={product.product_name}
          onToggle={() => onToggleStatus(product)}
        />
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer shrink-0"
        >
          <Edit size={13} /> Edit
        </button>
      </div>
    </div>
  );
}
