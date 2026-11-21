import { Edit } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { ImageThumbnail } from "./ImageInputField";
import StatusToggle from "./StatusToggle";
import { PRODUCT_STATUS, getProductTagMeta } from "./productConstants";

// Mã hiển thị của món, ví dụ #PRD-001
export function ProductCode({ productId, className = "text-xs" }) {
  return (
    <p className={`${className} text-[var(--text-muted)] font-mono`}>
      #PRD-{String(productId).padStart(3, "0")}
    </p>
  );
}

// Badge nhãn món (hot / spicy / veggie)
export function ProductTagBadge({ tag }) {
  const meta = getProductTagMeta(tag);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border whitespace-nowrap ${meta.classes}`}
    >
      <Icon size={10} /> {meta.label}
    </span>
  );
}

// Danh sách size kèm giá dạng chip, ví dụ "S $8.99"
export function ProductSizePrices({ sizes }) {
  if (!sizes || sizes.length === 0) {
    return (
      <span className="text-xs italic text-[var(--text-muted)]">No sizes</span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((sz) => (
        <span
          key={sz.product_size_id}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[var(--bg-subtle)] border border-[var(--border-light)] whitespace-nowrap"
        >
          <span className="font-bold text-[var(--text-secondary)]">
            {(sz.size_name || "?").charAt(0)}
          </span>
          <span className="font-black text-[var(--color-price)]">
            ${sz.price.toFixed(2)}
          </span>
        </span>
      ))}
    </div>
  );
}

// Toàn bộ add-on đang gắn với món (PRODUCT_ADDON), hiển thị dạng chip tự xuống dòng
export function ProductAddonSummary({ addonNames }) {
  if (addonNames.length === 0) {
    return (
      <span className="text-xs italic text-[var(--text-muted)]">
        No add-ons
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1 max-w-[280px]">
      {addonNames.map((name) => (
        <span
          key={name}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-light)]"
        >
          + {name}
        </span>
      ))}
    </div>
  );
}

// Component một dòng món ăn trong bảng quản lý (màn hình từ md trở lên)
export default function ProductTableRow({
  product,
  categoryName,
  colorIndex,
  addonNames,
  onToggleStatus,
  onEdit,
}) {
  const isAvailable = product.status !== PRODUCT_STATUS.UNAVAILABLE;

  return (
    <tr className="hover:bg-[var(--bg-main)] transition-colors">
      {/* Cột Món: ảnh + tên + mã + nhãn (mờ đi khi ngừng bán) */}
      <td className="px-6 py-4">
        <div
          className={`flex items-center gap-3 ${isAvailable ? "" : "opacity-60"}`}
        >
          <ImageThumbnail
            key={product.image}
            src={product.image}
            alt={product.product_name}
          />
          <div className="min-w-0 space-y-1">
            <p className="font-bold text-[var(--text-primary)] leading-snug">
              {product.product_name}
            </p>
            <div className="flex items-center gap-2">
              <ProductCode productId={product.product_id} />
              <ProductTagBadge tag={product.tag} />
            </div>
          </div>
        </div>
      </td>

      {/* Cột Category */}
      <td className="px-6 py-4">
        <CategoryBadge categoryName={categoryName} colorIndex={colorIndex} />
      </td>

      {/* Cột Size & Giá */}
      <td className="px-6 py-4">
        <ProductSizePrices sizes={product.sizes} />
      </td>

      {/* Cột Add-on: hiện tất cả add-on đang gắn với món */}
      <td className="px-6 py-4">
        <ProductAddonSummary addonNames={addonNames} />
      </td>

      {/* Cột Trạng thái bán: công tắc mở bán / ngừng bán */}
      <td className="px-6 py-4">
        <StatusToggle
          isOn={isAvailable}
          itemName={product.product_name}
          onToggle={() => onToggleStatus(product)}
        />
      </td>

      {/* Cột Nút thao tác Sửa */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer"
          >
            <Edit size={13} /> Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
