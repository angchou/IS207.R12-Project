import { useState } from "react";
import { X, Save, Plus, AlertCircle } from "lucide-react";
import ImageInputField from "./ImageInputField";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

const LABEL_CLASS =
  "block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5";

const MAX_TEXT_LENGTH = 255;

// Modal dùng chung để Thêm mới hoặc Chỉnh sửa Add-on (bảng ADD_ON)
export default function AddOnFormModal({
  addon,
  categories,
  existingNames,
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(addon);

  const [formData, setFormData] = useState({
    addon_name: addon?.addon_name || "",
    category_id: addon?.category_id ?? "",
    price: addon ? String(addon.price) : "",
    image: addon?.image || "",
    description: addon?.description || "",
  });

  const [error, setError] = useState("");

  // Cập nhật từng trường trong form
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Kiểm tra dữ liệu hợp lệ trước khi lưu (tên unique, giá > 0)
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.addon_name.trim();
    const priceValue = Number(formData.price);

    if (!trimmedName) {
      setError("Please enter an add-on name.");
      return;
    }

    if (trimmedName.length > MAX_TEXT_LENGTH) {
      setError(`Add-on name must be at most ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    // Kiểm tra trùng tên (bỏ qua tên hiện tại của chính add-on đang sửa)
    const isDuplicateName = existingNames.some(
      (name) =>
        name.toLowerCase() === trimmedName.toLowerCase() &&
        name.toLowerCase() !== (addon?.addon_name || "").toLowerCase(),
    );
    if (isDuplicateName) {
      setError("An add-on with this name already exists.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(priceValue) ||
      priceValue <= 0
    ) {
      setError("Price must be a number greater than 0.");
      return;
    }

    onSubmit({
      addon_name: trimmedName,
      category_id:
        formData.category_id === "" ? null : Number(formData.category_id),
      price: Math.round(priceValue * 100) / 100,
      image: formData.image.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] w-full sm:max-w-lg max-h-[90dvh] flex flex-col border-t-4 sm:border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header của Modal */}
        <div className="px-5 sm:px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
              {isEditing ? "Add-on Catalog" : "Menu Extras"}
            </span>
            <h3 className="text-lg font-black uppercase">
              {isEditing ? "Edit Add-on" : "Add New Add-on"}
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
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-[var(--bg-badge-discount)] border border-[var(--border-active)]/30 text-[var(--text-badge-discount)] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Tên add-on (duy nhất) */}
            <div>
              <label className={LABEL_CLASS}>
                Add-on Name{" "}
                <span className="text-[var(--status-error)]">*</span>
              </label>
              <input
                type="text"
                value={formData.addon_name}
                onChange={(e) => handleChange("addon_name", e.target.value)}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="e.g. Extra Mozzarella"
                className={`${INPUT_CLASS} font-semibold`}
              />
            </div>

            {/* Category + Giá */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                  className={`${INPUT_CLASS} font-bold`}
                >
                  <option value="">— No category —</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  Price <span className="text-[var(--status-error)]">*</span>
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
              </div>
            </div>

            {/* Ảnh: dán URL hoặc tải lên từ máy */}
            <div>
              <label className={LABEL_CLASS}>Image</label>
              <ImageInputField
                value={formData.image}
                onChange={(value) => handleChange("image", value)}
                previewAlt="Add-on preview"
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
              {isEditing ? "Save Changes" : "Create Add-on"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
