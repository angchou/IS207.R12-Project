import { useState, useMemo } from "react";
import {
  X,
  Save,
  Plus,
  Minus,
  AlertCircle,
  AlertTriangle,
  Search,
  Trash2,
  Wand2,
  Info,
} from "lucide-react";
import ImageInputField, { ImageThumbnail } from "./ImageInputField";
import { PRODUCT_TAGS, getProductStatusMeta } from "./productConstants";
import {
  COMBO_STATUS,
  COMBO_BADGE_SUGGESTIONS,
  MAX_ITEM_QUANTITY,
  buildSizeIndex,
  isProductOrderable,
  sumItemsPrice,
  buildComboDescription,
} from "./comboConstants";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

const LABEL_TEXT_CLASS =
  "block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]";
const LABEL_CLASS = `${LABEL_TEXT_CLASS} mb-1.5`;

const MAX_TEXT_LENGTH = 255;

// Nút tăng / giảm số lượng (bo 50%)
function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = MAX_ITEM_QUANTITY,
}) {
  const btnClass =
    "w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-divider)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--btn-primary-default)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={btnClass}
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-black">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={btnClass}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// Modal dùng chung để Tạo mới hoặc Chỉnh sửa Combo (COMBO + COMBO_DETAIL). Combo không có add-on.
export default function ComboFormModal({
  combo,
  initialItems = [],
  products,
  existingNames,
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(combo);
  const sizeIndex = useMemo(() => buildSizeIndex(products), [products]);

  const [formData, setFormData] = useState({
    combo_name: combo?.combo_name || "",
    price: combo ? String(combo.price) : "",
    badge: combo?.badge || "",
    tag: combo?.tag || PRODUCT_TAGS[0].value,
    image: combo?.image || "",
    description: combo?.description || "",
    status: combo?.status || COMBO_STATUS.AVAILABLE,
  });

  // Danh sách món đã chọn: [{ product_size_id, quantity }]
  const [items, setItems] = useState(() =>
    initialItems.map(({ product_size_id, quantity }) => ({
      product_size_id,
      quantity,
    })),
  );

  // Bộ chọn món: ô tìm kiếm, món đang chọn, size và số lượng muốn thêm
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickingProductId, setPickingProductId] = useState(null);
  const [pickingSizeId, setPickingSizeId] = useState(null);
  const [pickingQty, setPickingQty] = useState(1);
  const [error, setError] = useState("");
  // Đã thay đổi danh sách món chưa (khi sửa combo mà chưa đổi món thì giữ nguyên giá gốc đã lưu)
  const [itemsChanged, setItemsChanged] = useState(false);

  const clearError = () => error && setError("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError();
  };

  // Món đã chọn kèm thông tin món/size hiện tại (để biết món có đang ngừng bán không)
  const detailedItems = items.map((item) => ({
    ...item,
    product: sizeIndex[item.product_size_id]?.product || null,
    size: sizeIndex[item.product_size_id]?.size || null,
  }));

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const calculatedPrice = Math.round(sumItemsPrice(detailedItems) * 100) / 100;
  const keepStoredOriginal = isEditing && !itemsChanged;
  const originalPrice = keepStoredOriginal
    ? combo.original_price
    : calculatedPrice;
  const priceValue = Number(formData.price);
  const savings =
    formData.price !== "" && priceValue > 0 && priceValue < originalPrice
      ? originalPrice - priceValue
      : 0;
  const hasBlockedItems = detailedItems.some(
    (i) => !isProductOrderable(i.product),
  );

  // Danh sách món trong bộ chọn (lọc theo từ khóa)
  const pickerProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(pickerQuery.trim().toLowerCase()),
  );

  // Chọn một món để thêm (chỉ món AVAILABLE)
  const startPicking = (product) => {
    if (!isProductOrderable(product)) return;
    if (pickingProductId === product.product_id) {
      setPickingProductId(null);
      return;
    }
    setPickingProductId(product.product_id);
    setPickingSizeId(product.sizes?.[0]?.product_size_id ?? null);
    setPickingQty(1);
  };

  // Thêm món vào combo; trùng món + size thì cộng dồn số lượng
  const addPickedItem = () => {
    if (!pickingSizeId) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product_size_id === pickingSizeId);
      if (existing) {
        return prev.map((i) =>
          i.product_size_id === pickingSizeId
            ? {
                ...i,
                quantity: Math.min(MAX_ITEM_QUANTITY, i.quantity + pickingQty),
              }
            : i,
        );
      }
      return [
        ...prev,
        { product_size_id: pickingSizeId, quantity: pickingQty },
      ];
    });
    setPickingProductId(null);
    setItemsChanged(true);
    clearError();
  };

  const updateItemQuantity = (productSizeId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product_size_id === productSizeId ? { ...i, quantity } : i,
      ),
    );
    setItemsChanged(true);
    clearError();
  };

  const removeItem = (productSizeId) => {
    setItems((prev) => prev.filter((i) => i.product_size_id !== productSizeId));
    setItemsChanged(true);
    clearError();
  };

  // Kiểm tra dữ liệu hợp lệ trước khi lưu
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.combo_name.trim();
    const trimmedBadge = formData.badge.trim().toUpperCase();

    if (!trimmedName) {
      setError("Please enter a combo name.");
      return;
    }
    if (trimmedName.length > MAX_TEXT_LENGTH) {
      setError(`Combo name must be at most ${MAX_TEXT_LENGTH} characters.`);
      return;
    }
    const isDuplicateName = existingNames.some(
      (name) =>
        name.toLowerCase() === trimmedName.toLowerCase() &&
        name.toLowerCase() !== (combo?.combo_name || "").toLowerCase(),
    );
    if (isDuplicateName) {
      setError("A combo with this name already exists.");
      return;
    }

    if (totalQuantity < 2) {
      setError("A combo must contain at least 2 items in total.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(priceValue) ||
      priceValue <= 0
    ) {
      setError("Combo price must be a number greater than 0.");
      return;
    }
    const roundedPrice = Math.round(priceValue * 100) / 100;
    if (roundedPrice >= originalPrice) {
      setError(
        `Combo price must be lower than the original price ($${originalPrice.toFixed(2)}).`,
      );
      return;
    }

    if (!trimmedBadge) {
      setError("Please enter a badge (e.g. BEST SELLER).");
      return;
    }
    if (trimmedBadge.length > MAX_TEXT_LENGTH) {
      setError(`Badge must be at most ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    // Ảnh bắt buộc: trang Customer luôn hiển thị ảnh combo
    if (!formData.image.trim()) {
      setError("Please add a combo image (paste a URL or upload a file).");
      return;
    }

    // Mô tả để trống thì tự tạo từ danh sách món
    const description = (
      formData.description.trim() || buildComboDescription(detailedItems)
    ).slice(0, MAX_TEXT_LENGTH);

    onSubmit({
      values: {
        combo_name: trimmedName,
        price: roundedPrice,
        original_price: originalPrice,
        image: formData.image.trim(),
        description,
        badge: trimmedBadge,
        tag: formData.tag,
        status: formData.status,
      },
      items,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] w-full sm:max-w-2xl max-h-[90dvh] flex flex-col border-t-4 sm:border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header của Modal */}
        <div className="px-5 sm:px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
              {isEditing ? "Value Meal Boxes" : "New Combo Deal"}
            </span>
            <h3 className="text-lg font-black uppercase">
              {isEditing ? "Edit Combo" : "Create Combo"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-surface)]/10 text-[var(--bg-hero)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-[var(--bg-badge-discount)] border border-[var(--border-active)]/30 text-[var(--text-badge-discount)] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ============ 1. CHỌN MÓN TỪ DANH SÁCH MÓN ĂN ============ */}
            <div>
              <label className={LABEL_CLASS}>
                Combo Items{" "}
                <span className="text-[var(--status-error)]">*</span>
              </label>
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)] mb-2">
                <Info size={12} className="shrink-0" />
                Add-ons are not available for combos. Sold out or unavailable
                products cannot be selected.
              </p>

              {/* Bộ chọn món */}
              <div className="border-2 border-[var(--border-light)]">
                <div className="relative border-b border-[var(--border-light)]">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                  <input
                    type="text"
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="Search products to add..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <ul className="max-h-56 overflow-y-auto divide-y divide-[var(--border-light)]">
                  {pickerProducts.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-[var(--text-muted)]">
                      No products match your search.
                    </li>
                  )}
                  {pickerProducts.map((product) => {
                    const orderable = isProductOrderable(product);
                    const isPicking = pickingProductId === product.product_id;
                    const statusMeta = getProductStatusMeta(product.status);
                    return (
                      <li key={product.product_id}>
                        <button
                          type="button"
                          disabled={!orderable}
                          onClick={() => startPicking(product)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                            orderable
                              ? `cursor-pointer hover:bg-[var(--bg-subtle)] ${isPicking ? "bg-[var(--bg-subtle)]" : ""}`
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          <ImageThumbnail
                            key={product.image}
                            src={product.image}
                            alt={product.product_name}
                            sizeClass="w-10 h-10"
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-bold text-[var(--text-primary)] truncate">
                              {product.product_name}
                            </span>
                            <span className="block text-[11px] text-[var(--text-muted)]">
                              {(product.sizes || [])
                                .map(
                                  (s) =>
                                    `${s.size_name?.charAt(0)} $${s.price.toFixed(2)}`,
                                )
                                .join(" · ")}
                            </span>
                          </span>
                          {orderable ? (
                            <Plus
                              size={16}
                              className="text-[var(--btn-primary-default)] shrink-0"
                            />
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border whitespace-nowrap ${statusMeta.pillClasses}`}
                            >
                              {statusMeta.label}
                            </span>
                          )}
                        </button>

                        {/* Chọn size + số lượng cho món đang chọn */}
                        {isPicking && (
                          <div className="px-3 pb-3 pt-1 bg-[var(--bg-subtle)] space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {(product.sizes || []).map((size) => {
                                const active =
                                  pickingSizeId === size.product_size_id;
                                return (
                                  <button
                                    key={size.product_size_id}
                                    type="button"
                                    onClick={() =>
                                      setPickingSizeId(size.product_size_id)
                                    }
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                      active
                                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                                    }`}
                                  >
                                    {size.size_name} · ${size.price.toFixed(2)}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <QuantityStepper
                                value={pickingQty}
                                onChange={setPickingQty}
                              />
                              <button
                                type="button"
                                onClick={addPickedItem}
                                disabled={!pickingSizeId}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] disabled:bg-[var(--btn-primary-disabled)] cursor-pointer disabled:cursor-not-allowed"
                              >
                                <Plus size={14} /> Add to combo
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Danh sách món đã chọn */}
              <div className="mt-3 border-2 border-[var(--border-divider)]">
                <p className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-light)] flex justify-between">
                  <span>Selected items</span>
                  <span>{totalQuantity} pcs</span>
                </p>
                {detailedItems.length === 0 ? (
                  <p className="px-4 py-5 text-center text-xs text-[var(--text-muted)]">
                    No items yet. Pick at least 2 items from the list above.
                  </p>
                ) : (
                  <ul className="divide-y divide-[var(--border-light)]">
                    {detailedItems.map((item) => {
                      const blocked = !isProductOrderable(item.product);
                      return (
                        <li
                          key={item.product_size_id}
                          className={`px-3 sm:px-4 py-2.5 flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-2 ${
                            blocked ? "bg-[var(--status-warning)]/5" : ""
                          }`}
                        >
                          <span className="flex-1 min-w-[160px]">
                            <span className="block text-sm font-bold text-[var(--text-primary)]">
                              {item.product?.product_name || "Removed item"}{" "}
                              {item.size?.size_name && (
                                <span className="font-semibold text-[var(--text-muted)]">
                                  ({item.size.size_name})
                                </span>
                              )}
                            </span>
                            {blocked && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--status-warning)]">
                                <AlertTriangle size={11} />
                                {
                                  getProductStatusMeta(item.product?.status)
                                    .label
                                }{" "}
                                — customers cannot order this combo
                              </span>
                            )}
                          </span>
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(q) =>
                              updateItemQuantity(item.product_size_id, q)
                            }
                          />
                          <span className="w-16 text-right text-sm font-black text-[var(--color-price)]">
                            $
                            {((item.size?.price || 0) * item.quantity).toFixed(
                              2,
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product_size_id)}
                            aria-label="Remove item"
                            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {hasBlockedItems && (
                <p className="mt-2 text-[11px] font-bold text-[var(--status-warning)]">
                  This combo contains sold out or unavailable products, so
                  customers will not be able to order it until they are
                  available again or removed.
                </p>
              )}
            </div>

            {/* ============ 2. TÊN COMBO ============ */}
            <div>
              <label className={LABEL_CLASS}>
                Combo Name <span className="text-[var(--status-error)]">*</span>
              </label>
              <input
                type="text"
                value={formData.combo_name}
                onChange={(e) => handleChange("combo_name", e.target.value)}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="e.g. Weekend Family Feast"
                className={`${INPUT_CLASS} font-semibold`}
              />
            </div>

            {/* ============ 3. GIÁ COMBO ============ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Original Price</label>
                <div className="px-3.5 py-2.5 border border-dashed border-[var(--border-divider)] bg-[var(--bg-subtle)] text-sm font-black text-[var(--text-muted)] line-through">
                  ${originalPrice.toFixed(2)}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  {keepStoredOriginal
                    ? "Current saved price. Recalculated when you change the items."
                    : "Auto-calculated from selected items."}
                </p>
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  Combo Price{" "}
                  <span className="text-[var(--status-error)]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--text-muted)]">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                    className={`${INPUT_CLASS} pl-8 font-bold`}
                  />
                </div>
                {savings > 0 && (
                  <p className="text-[11px] font-bold text-[var(--status-success)] mt-1">
                    Customers save ${savings.toFixed(2)} (
                    {Math.round((savings / originalPrice) * 100)}%)
                  </p>
                )}
              </div>
            </div>

            {/* ============ 4. BADGE + TAG ============ */}
            <div>
              <label className={LABEL_CLASS}>
                Badge <span className="text-[var(--status-error)]">*</span>
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) =>
                  handleChange("badge", e.target.value.toUpperCase())
                }
                maxLength={MAX_TEXT_LENGTH}
                placeholder="e.g. BEST SELLER"
                className={`${INPUT_CLASS} font-black uppercase`}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMBO_BADGE_SUGGESTIONS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => handleChange("badge", badge)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border transition-all cursor-pointer ${
                      formData.badge === badge
                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                        : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>
                Menu Tag <span className="text-[var(--status-error)]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_TAGS.map((tag) => {
                  const isActive = formData.tag === tag.value;
                  const Icon = tag.icon;
                  return (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => handleChange("tag", tag.value)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase border transition-all cursor-pointer ${
                        isActive ? tag.activeClasses : tag.classes
                      }`}
                    >
                      <Icon size={13} /> {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============ 5. ẢNH + MÔ TẢ ============ */}
            <div>
              <label className={LABEL_CLASS}>
                Image <span className="text-[var(--status-error)]">*</span>
              </label>
              <ImageInputField
                value={formData.image}
                onChange={(value) => handleChange("image", value)}
                previewAlt="Combo preview"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className={LABEL_TEXT_CLASS}>Description</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={detailedItems.length === 0}
                    onClick={() =>
                      handleChange(
                        "description",
                        buildComboDescription(detailedItems).slice(
                          0,
                          MAX_TEXT_LENGTH,
                        ),
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-[var(--btn-primary-default)] hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Wand2 size={12} /> Generate from items
                  </button>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">
                    {formData.description.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
              </div>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="Leave blank to generate from the selected items"
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {/* ============ 6. TRẠNG THÁI ============ */}
            <div>
              <label className={LABEL_CLASS}>Availability</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: COMBO_STATUS.AVAILABLE,
                    label: "Available",
                    active:
                      "bg-[var(--status-success)] text-[var(--text-inverse)] border-[var(--status-success)]",
                  },
                  {
                    value: COMBO_STATUS.UNAVAILABLE,
                    label: "Unavailable",
                    active:
                      "bg-[var(--text-muted)] text-[var(--text-inverse)] border-[var(--text-muted)]",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={formData.status === opt.value}
                    onClick={() => handleChange("status", opt.value)}
                    className={`px-3 py-2.5 rounded-full text-xs font-bold uppercase border transition-all cursor-pointer ${
                      formData.status === opt.value
                        ? opt.active
                        : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Unavailable combos are hidden from customers.
              </p>
            </div>
          </div>

          {/* Nút hành động dưới đáy Modal */}
          <div className="px-5 sm:px-6 py-4 border-t border-[var(--border-light)] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full text-xs font-bold uppercase text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
            >
              {isEditing ? <Save size={15} /> : <Plus size={15} />}
              {isEditing ? "Save Changes" : "Create Combo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
