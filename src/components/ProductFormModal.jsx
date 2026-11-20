import { useState } from "react";
import { X, Save, Plus, AlertCircle, Check, Lock } from "lucide-react";
import ImageInputField from "./ImageInputField";
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TAGS,
} from "./productConstants";
import { MOCK_SIZES } from "../data/mockData";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)] disabled:opacity-50 disabled:cursor-not-allowed";

const LABEL_TEXT_CLASS =
  "block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]";
const LABEL_CLASS = `${LABEL_TEXT_CLASS} mb-1.5`;

const MAX_TEXT_LENGTH = 255;

// Khởi tạo trạng thái chọn size từ product.sizes (PRODUCT_SIZE join SIZE)
function buildInitialSizes(product) {
  return MOCK_SIZES.reduce((map, size) => {
    const existing = product?.sizes?.find((s) => s.size_id === size.size_id);
    map[size.size_id] = {
      checked: Boolean(existing),
      price: existing ? String(existing.price) : "",
    };
    return map;
  }, {});
}

// Modal dùng chung để Thêm mới hoặc Chỉnh sửa Món ăn (PRODUCT + PRODUCT_SIZE + PRODUCT_ADDON)
export default function ProductFormModal({
  product,
  categories,
  addons,
  addonCategories,
  initialAddonIds = [],
  lockedSizeIds = [],
  existingNames,
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    product_name: product?.product_name || "",
    category_id: product?.category_id ?? categories[0]?.category_id ?? "",
    tag: product?.tag || PRODUCT_TAGS[0].value,
    status: product?.status || PRODUCT_STATUS.AVAILABLE,
    image: product?.image || "",
    description: product?.description || "",
  });
  const [sizeState, setSizeState] = useState(() => buildInitialSizes(product));
  const [selectedAddonIds, setSelectedAddonIds] = useState(initialAddonIds);
  const [error, setError] = useState("");

  // Cập nhật từng trường trong form
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Bật/tắt một size hoặc đổi giá của size đó
  const handleSizeChange = (sizeId, patch) => {
    setSizeState((prev) => ({
      ...prev,
      [sizeId]: { ...prev[sizeId], ...patch },
    }));
    if (error) setError("");
  };

  // Chọn / bỏ chọn một add-on (được phép không chọn add-on nào)
  const toggleAddon = (addonId) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  // Nhóm add-on theo category (thêm nhóm "Uncategorized" nếu có add-on chưa có category)
  const addonGroups = [
    ...addonCategories.map((cat) => ({
      key: cat.category_id,
      name: cat.category_name,
      items: addons.filter((a) => a.category_id === cat.category_id),
    })),
    {
      key: "none",
      name: "Uncategorized",
      items: addons.filter(
        (a) => a.category_id === null || a.category_id === undefined,
      ),
    },
  ].filter((group) => group.items.length > 0);

  // Kiểm tra dữ liệu hợp lệ trước khi lưu
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.product_name.trim();

    if (!trimmedName) {
      setError("Please enter a product name.");
      return;
    }

    if (trimmedName.length > MAX_TEXT_LENGTH) {
      setError(`Product name must be at most ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    // Kiểm tra trùng tên (bỏ qua tên hiện tại của chính món đang sửa)
    const isDuplicateName = existingNames.some(
      (name) =>
        name.toLowerCase() === trimmedName.toLowerCase() &&
        name.toLowerCase() !== (product?.product_name || "").toLowerCase(),
    );
    if (isDuplicateName) {
      setError("A product with this name already exists.");
      return;
    }

    if (formData.category_id === "") {
      setError("Please select a category.");
      return;
    }

    // Ảnh bắt buộc: trang Customer luôn hiển thị ảnh món
    if (!formData.image.trim()) {
      setError("Please add a product image (paste a URL or upload a file).");
      return;
    }

    // Size: phải chọn ít nhất 1 size và mọi size đã chọn phải có giá > 0
    const chosenSizes = MOCK_SIZES.filter(
      (size) => sizeState[size.size_id]?.checked,
    );
    if (chosenSizes.length === 0) {
      setError("Please select at least one size with a price.");
      return;
    }

    const sizeInputs = [];
    for (const size of chosenSizes) {
      const raw = sizeState[size.size_id].price;
      const price = Number(raw);
      if (raw === "" || !Number.isFinite(price) || price <= 0) {
        setError(`Price for size ${size.size_name} must be greater than 0.`);
        return;
      }
      sizeInputs.push({
        size_id: size.size_id,
        price: Math.round(price * 100) / 100,
      });
    }

    onSubmit({
      values: {
        product_name: trimmedName,
        category_id: Number(formData.category_id),
        tag: formData.tag,
        status: formData.status,
        image: formData.image.trim(),
        description: formData.description.trim(),
      },
      sizes: sizeInputs,
      addonIds: selectedAddonIds,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] w-full sm:max-w-2xl max-h-[90dvh] flex flex-col border-t-4 sm:border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header của Modal */}
        <div className="px-5 sm:px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
              {isEditing ? "Kitchen Menu Catalog" : "New Menu Item"}
            </span>
            <h3 className="text-lg font-black uppercase">
              {isEditing ? "Edit Product" : "Add New Product"}
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
          {/* Nội dung Form (cuộn được khi màn hình thấp / bàn phím mở) */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-[var(--bg-badge-discount)] border border-[var(--border-active)]/30 text-[var(--text-badge-discount)] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Tên món (duy nhất) */}
            <div>
              <label className={LABEL_CLASS}>
                Product Name{" "}
                <span className="text-[var(--status-error)]">*</span>
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => handleChange("product_name", e.target.value)}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="e.g. Double Cheese Smash Burger"
                className={`${INPUT_CLASS} font-semibold`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={LABEL_CLASS}>
                Category <span className="text-[var(--status-error)]">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                className={`${INPUT_CLASS} font-bold`}
              >
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái bán: Available / Sold Out / Unavailable (chỉ Admin thấy) */}
            <div>
              <label className={LABEL_CLASS}>Availability</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRODUCT_STATUS_OPTIONS.map((opt) => {
                  const isActive = formData.status === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleChange("status", opt.value)}
                      className={`flex items-start gap-2 px-3 py-2.5 border text-left transition-all cursor-pointer ${
                        isActive
                          ? opt.activeClasses
                          : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                      }`}
                    >
                      <Icon size={15} className="shrink-0 mt-0.5" />
                      <span className="min-w-0">
                        <span className="block text-xs font-black uppercase">
                          {opt.label}
                        </span>
                        <span
                          className={`block text-[11px] font-medium leading-snug ${
                            isActive ? "opacity-90" : "text-[var(--text-muted)]"
                          }`}
                        >
                          {opt.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nhãn món (cột tag NOT NULL) */}
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

            {/* Ảnh: dán URL hoặc tải lên từ máy */}
            <div>
              <label className={LABEL_CLASS}>
                Image <span className="text-[var(--status-error)]">*</span>
              </label>
              <ImageInputField
                value={formData.image}
                onChange={(value) => handleChange("image", value)}
                previewAlt="Product preview"
              />
            </div>

            {/* Mô tả */}
            <div>
              <div className="flex items-center justify-between">
                <label className={LABEL_CLASS}>Description</label>
                <span className="text-[10px] font-bold text-[var(--text-muted)] mb-1.5">
                  {formData.description.length}/{MAX_TEXT_LENGTH}
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="Short description shown to customers..."
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {/* Size & Giá (PRODUCT_SIZE) */}
            <div>
              <label className={LABEL_CLASS}>
                Sizes & Prices{" "}
                <span className="text-[var(--status-error)]">*</span>
              </label>
              <div className="space-y-2">
                {MOCK_SIZES.map((size) => {
                  const state = sizeState[size.size_id];
                  const isLocked = lockedSizeIds.includes(size.size_id);
                  return (
                    <div
                      key={size.size_id}
                      className={`flex items-center gap-3 p-3 border transition-colors ${
                        state.checked
                          ? "border-[var(--btn-primary-default)]/40 bg-[var(--bg-subtle)]"
                          : "border-[var(--border-light)] bg-[var(--bg-surface)]"
                      }`}
                    >
                      <label className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.checked}
                          disabled={isLocked}
                          onChange={(e) =>
                            handleSizeChange(size.size_id, {
                              checked: e.target.checked,
                            })
                          }
                          className="w-4 h-4 shrink-0 accent-[var(--btn-primary-default)] cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {size.size_name}
                        </span>
                        {isLocked && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[var(--text-muted)]"
                            title="This size is part of a combo and cannot be removed"
                          >
                            <Lock size={10} /> Used in combo
                          </span>
                        )}
                      </label>
                      <div className="relative w-28 sm:w-32 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--text-muted)]">
                          $
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0.01"
                          value={state.price}
                          disabled={!state.checked}
                          onChange={(e) =>
                            handleSizeChange(size.size_id, {
                              price: e.target.value,
                            })
                          }
                          placeholder="0.00"
                          className={`${INPUT_CLASS} pl-7 py-2 font-bold`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add-on đi kèm (PRODUCT_ADDON) - không bắt buộc */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className={LABEL_TEXT_CLASS}>
                  Add-ons{" "}
                  <span className="normal-case font-semibold tracking-normal text-[var(--text-muted)]">
                    (optional · {selectedAddonIds.length} selected)
                  </span>
                </label>
                {selectedAddonIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedAddonIds([])}
                    className="text-[11px] font-bold uppercase text-[var(--btn-primary-default)] hover:underline cursor-pointer shrink-0"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {addonGroups.length === 0 ? (
                <p className="text-xs italic text-[var(--text-muted)]">
                  No add-ons available. Create add-ons in Add-ons Management
                  first.
                </p>
              ) : (
                <div className="space-y-3">
                  {addonGroups.map((group) => (
                    <div key={group.key}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        {group.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((addon) => {
                          const isChecked = selectedAddonIds.includes(
                            addon.addon_id,
                          );
                          return (
                            <button
                              key={addon.addon_id}
                              type="button"
                              aria-pressed={isChecked}
                              onClick={() => toggleAddon(addon.addon_id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                isChecked
                                  ? "bg-[var(--bg-hero)] text-[var(--text-primary)] border-[var(--btn-secondary-default)]"
                                  : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-secondary-default)]"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? "bg-[var(--btn-secondary-default)] border-[var(--btn-secondary-default)] text-[var(--text-inverse)]"
                                    : "border-[var(--border-divider)]"
                                }`}
                              >
                                {isChecked && <Check size={10} />}
                              </span>
                              {addon.addon_name}
                              <span className="text-[var(--text-muted)] font-semibold">
                                +${addon.price.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
